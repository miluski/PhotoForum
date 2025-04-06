package com.photo.forum.backend;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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
            boolean isNonProtectedUri = this.checkIfUriIsNotProtected(httpServletRequest);
            if (isNonProtectedUri) {
                filterChain.doFilter(httpServletRequest, httpServletResponse);
                return;
            }
            this.handleProtectedUriRequest(httpServletRequest, httpServletResponse, filterChain);
        } catch (Exception e) {
            System.out.println("Error occurred while filtering request with URI " + httpServletRequest.getRequestURI());
            e.printStackTrace();
        }
    }

    private void handleProtectedUriRequest(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse,
            FilterChain filterChain) throws ServletException, IOException {
        String requestUri = httpServletRequest.getRequestURI();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isRefreshTokenRequest = requestUri.contains("/api/v1/auth/refresh-tokens")
                || requestUri.contains("/api/v1/auth/logout");
        boolean isNotAuthenticated = (authentication == null || !authentication.isAuthenticated());
        if (isNotAuthenticated) {
            boolean isTokenValid = this.isTokenValid(httpServletRequest, isRefreshTokenRequest ? "REFRESH" : "ACCESS");
            if (!isTokenValid) {
                this.setUnauthorizedResponseCredentials(httpServletRequest, httpServletResponse);
            } else {
                this.setAuthentication(httpServletRequest);
                filterChain.doFilter(httpServletRequest, httpServletResponse);
            }
        }
    }

    private boolean checkIfUriIsNotProtected(HttpServletRequest httpServletRequest) {
        String requestUri = httpServletRequest.getRequestURI();
        return this.nonProtectedUris.stream().anyMatch(uri -> requestUri.contains(uri) || uri.equals(requestUri));
    }

    private boolean isTokenValid(HttpServletRequest httpServletRequest, String tokenType) {
        boolean isTokenValid = false;
        boolean isAccessToken = tokenType.equals("ACCESS");
        Cookie[] cookiesArray = httpServletRequest.getCookies();
        Map<String, Cookie> tokensMap = this.cookieService.getTokensFromRequestCookies(cookiesArray);
        if (!tokensMap.isEmpty()) {
            Cookie tokenCookie = isAccessToken ? tokensMap.get("ACCESS_TOKEN") : tokensMap.get("REFRESH_TOKEN");
            if (tokenCookie != null) {
                this.token = tokenCookie.getValue();
                isTokenValid = this.tokenService.isTokenValid(token);
            }
        }
        return isTokenValid;
    }

    private void setUnauthorizedResponseCredentials(HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) throws IOException {
        String requestUri = httpServletRequest.getRequestURI();
        boolean isRequestUriRefreshing = requestUri.contains("/api/v1/auth/refresh-tokens");
        if (isRequestUriRefreshing) {
            httpServletResponse.setStatus(HttpStatus.FORBIDDEN.value());
        } else {
            httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
        }
    }

    private void setAuthentication(HttpServletRequest httpServletRequest) {
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