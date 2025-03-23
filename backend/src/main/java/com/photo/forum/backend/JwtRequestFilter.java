package com.photo.forum.backend;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.photo.forum.backend.services.CookieService;
import com.photo.forum.backend.services.TokenService;
import com.photo.forum.backend.services.UserDetailsServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private String token;
    private HttpServletRequest httpServletRequest;
    private HttpServletResponse httpServletResponse;

    private final TokenService tokenService;
    private final CookieService cookieService;
    private final List<String> nonProtectedUris;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    @Autowired
    public JwtRequestFilter(TokenService tokenService, CookieService cookieService,
            UserDetailsServiceImpl userDetailsServiceImpl) {
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.nonProtectedUris = List.of("/api/v1/photos/public", "/api/v1/photos/posts", "/api/v1/auth/login",
                "/api/v1/auth/register");
        this.userDetailsServiceImpl = userDetailsServiceImpl;
    }

    @Override
    @SuppressWarnings("null")
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
            FilterChain filterChain) {
        try {
            this.httpServletRequest = httpServletRequest;
            this.httpServletResponse = httpServletResponse;
            this.handleProtectedUriRequest();
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        } catch (Exception e) {
            System.out.println("Error occured while filtering request with uri " + httpServletRequest.getRequestURI());
            e.printStackTrace();
        }
    }

    private void handleProtectedUriRequest() throws ServletException, IOException {
        String requestUri = httpServletRequest.getRequestURI();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isRefreshTokenRequest = requestUri.contains("/api/v1/auth/refresh-tokens")
                || requestUri.contains("/api/v1/auth/logout");
        boolean isNotAuthenticated = authentication == null;
        if (this.checkIfUriIsProtected() && isNotAuthenticated) {
            boolean isTokenValid = this.isTokenValid(isRefreshTokenRequest ? "REFRESH" : "ACCESS");
            if (isTokenValid == false) {
                this.setUnauthorizedResponseCredentials();
            } else {
                this.setAuthentication();
            }
        }
    }

    private boolean checkIfUriIsProtected() throws ServletException, IOException {
        String requestUri = httpServletRequest.getRequestURI();
        Stream<String> nonProtectedUrisStream = this.nonProtectedUris.stream();
        boolean isNonProtectedUri = nonProtectedUrisStream.anyMatch(uri -> uri.equals(requestUri));
        boolean isPhotoUriProtected = requestUri.contains("add-comment") || requestUri.contains("add-to-favourites");
        return isNonProtectedUri == false || isPhotoUriProtected;
    }

    private boolean isTokenValid(String tokenType) {
        boolean isTokenValid = false;
        boolean isAccessToken = tokenType.equals("ACCESS");
        Cookie[] cookiesArray = this.httpServletRequest.getCookies();
        Map<String, Cookie> tokensMap = this.cookieService.getTokensFromRequestCookies(cookiesArray);
        boolean isTokenListNotEmpty = tokensMap.isEmpty() == false;
        if (isTokenListNotEmpty) {
            Cookie tokenCookie = isAccessToken ? tokensMap.get("ACCESS_TOKEN") : tokensMap.get("REFRESH_TOKEN");
            this.token = tokenCookie.getValue();
            isTokenValid = this.tokenService.isTokenValid(token);
        }
        return isTokenValid;
    }

    private void setUnauthorizedResponseCredentials() throws IOException {
        int unauthorizedStatus = HttpStatus.UNAUTHORIZED.value();
        PrintWriter responseWriter = this.httpServletResponse.getWriter();
        this.httpServletResponse.setStatus(unauthorizedStatus);
        responseWriter.write("Not enough permissions to access this endpoint.");
    }

    private void setAuthentication() {
        String userLogin = this.tokenService.getClaimFromToken("subject", this.token);
        UserDetails userDetails = this.userDetailsServiceImpl.loadUserByUsername(userLogin);
        SecurityContext securityContext = SecurityContextHolder.getContext();
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        WebAuthenticationDetails webAuthenticationDetails = new WebAuthenticationDetailsSource()
                .buildDetails(httpServletRequest);
        usernamePasswordAuthenticationToken.setDetails(webAuthenticationDetails);
        securityContext.setAuthentication(usernamePasswordAuthenticationToken);
    }
}