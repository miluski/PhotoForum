package com.photo.forum.backend.services;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.photo.forum.backend.model.entity.User;
import com.photo.forum.backend.repositories.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class TokenService {

    public String tokenType;

    @Value("${jwt.secret}")
    private String tokenSecretKey;

    @Value("${jwt.expiration}")
    private String accessTokenExpiration;

    @Value("${jwt.refresh.expiration}")
    private String refreshTokenExpiration;

    private final CookieService cookieService;
    private final UserRepository userRepository;

    @Autowired
    public TokenService(CookieService cookieService, UserRepository userRepository) {
        this.cookieService = cookieService;
        this.userRepository = userRepository;
    }

    public boolean isTokenValid(String token) {
        try {
            String userLogin = this.getClaimFromToken("subject", token);
            Date expirationDate = this.getClaimFromToken("expiration", token);
            boolean isUserExists = this.isUserExists(userLogin);
            boolean isTokenNotExpired = expirationDate.before(expirationDate) == false;
            return isUserExists && isTokenNotExpired;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String getToken(String userLogin) {
        Key signKey = this.getSignKey();
        Date expirationDate = this.getExpirationDate();
        Date currentDate = new Date(System.currentTimeMillis());
        return Jwts
                .builder()
                .issuedAt(currentDate)
                .subject(userLogin)
                .expiration(expirationDate)
                .signWith(signKey)
                .compact();
    }

    @SuppressWarnings("unchecked")
    public <T> T getClaimFromToken(String claimType, String token) {
        Claims claims = this.getClaimsFromToken(token);
        boolean isClaimTypeEqualSubject = claimType.equals("subject");
        return isClaimTypeEqualSubject ? (T) claims.getSubject() : (T) claims.getExpiration();
    }

    public void addTokensToResponse(String userLogin, HttpServletResponse httpServletResponse) {
        Cookie accessTokenCookie = this.getTokenCookie("ACCESS", userLogin);
        Cookie refreshTokenCookie = this.getTokenCookie("REFRESH", userLogin);
        httpServletResponse.addCookie(accessTokenCookie);
        httpServletResponse.addCookie(refreshTokenCookie);
    }

    private Cookie getTokenCookie(String tokenType, String userLogin) {
        this.tokenType = tokenType;
        String tokenValue = this.getToken(userLogin);
        return this.cookieService.getCookie(tokenType + "_TOKEN", tokenValue);
    }

    private Claims getClaimsFromToken(String token) {
        SecretKey signKey = (SecretKey) this.getSignKey();
        return Jwts
                .parser()
                .verifyWith(signKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Key getSignKey() {
        return new SecretKeySpec(tokenSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    private Date getExpirationDate() {
        boolean isRefreshToken = this.tokenType.equals("REFRESH");
        Long currentTime = System.currentTimeMillis();
        String expirationTime = isRefreshToken ? this.refreshTokenExpiration : this.accessTokenExpiration;
        Long tokenExpirationInterval = Long.valueOf(expirationTime);
        return new Date(currentTime + tokenExpirationInterval);
    }

    private boolean isUserExists(String userLogin) {
        Optional<User> user = userRepository.findByLogin(userLogin);
        return user.isPresent();
    }
}
