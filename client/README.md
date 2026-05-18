TO DO:

# Replace all the "places" by proper term

# Check name for secure data url with Mina and Rut to use in my axios.get request. Profile.tsx

# Warning Explanation on login page of Auth0

    Message:

    "One or more of your connections are currently using Auth0 development keys and should not be used in production."
    Cause:

    Your Auth0 application is using development keys (default for testing). These are not secure for production environments.

    What It Means for You

    For Development: This is fine. You can continue testing locally.
    For Production: Before deploying your app, Rut/Mina must:

    Replace development keys with production keys in the Auth0 Dashboard.
    Configure a custom domain (optional but recommended for security).

#💡 I need to know:

1.  The exact endpoint paths
2.  How to send the Auth0 access token
3.  CORS must allow http://localhost:5173
4.  The response format for each endpoint
    Also, can you confirm if you need the Auth0 Audience value? If so, please create an API in Auth0 and give me its Identifier."\*

# The server is configured with a public base URL of /frontEnd/ - did you mean to visit /frontEnd/profile instead?
