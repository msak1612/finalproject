1. Registration
2. Login
3. stuff we see all times - logo, profile picture (open)
4. own profile page - edit your bio
5. showing other people's profile [testing in React]
6. Find People (3 recent people registered displays) - React Hooks
7. Friend button {hardest part} send/accept/unfriend/end friend request {db query is hardest}
8. Redux
9. Chat - site wise chat (no private chat) - socket.io(realtime chat)
10. bonus -> friday on week 11 is presentation.
    basic auth (sassafras)

Part-1
++++++

1. Registration, Something went wrong, Successful Registration
   how to know user has logged in or not.
   Components - a. Registration - (form & button)
   b. Welcome - (Welcome to, logo) (it has registration component in it)
   localhost:8080/welcome#
   React router - react login, login will be using hash(#) #/, #/login

How to set up logged-in or not? (3ways)

1. client side app know whether or not user logged-in
   route - /welcome -> then user has logged out
   route - anything else -> user is logged in

2. startjs can look at cookies. loggein = true.

3. axios request.. some route to know whether user has logged-in or not.
