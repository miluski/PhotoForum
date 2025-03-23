package com.photo.forum.backend.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;

@Service
public class CookieService {

    @Value("${jwt.expiration}")
    private String accessTokenExpiration;

    @Value("${jwt.refresh.expiration}")
    private String refreshTokenExpiration;

    public Cookie getCookie(String name, String value) {
        return this.getCookie(name, value, false);
    }

    public Cookie getCookie(String name, String value, boolean isExpired) {
        boolean isAccessTokenCookie = name.equals("ACCESS_TOKEN");
        int cookieMaxAge = isAccessTokenCookie ? Integer.valueOf(accessTokenExpiration)
                : Integer.valueOf(refreshTokenExpiration);
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setMaxAge(isExpired ? 0 : cookieMaxAge);
        cookie.setHttpOnly(true);
        cookie.setAttribute("SameSite", "None");
        return cookie;
    }

    public Map<String, Cookie> getTokensFromRequestCookies(Cookie[] requestCookies) {
        Map<String, Cookie> tokenCookies = new HashMap<>();
        if (requestCookies != null) {
            for (Cookie requestCookie : requestCookies) {
                boolean isRequestCookieValid = requestCookie.getName().contains("_TOKEN");
                if (isRequestCookieValid) {
                    tokenCookies.put(requestCookie.getName(), requestCookie);
                }
            }
        }
        return tokenCookies;
    }

}
