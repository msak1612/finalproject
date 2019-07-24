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

Day-2

---

index.js -
browserFetch replaces axios

Part-2
++++++
can be element.. no need of form ... ajax-req to server. hash(bcrypt)
sends res.json .. if doesnt works, sends error message
Login to be class component.
o/p -> redirects to /, user can see logo..
conditional routing based on url, use React Router. For other things, use your logic.
third section try to apply on Part-1 and Part-2

--- Use React Router
--- Use React Link instead of anchor href

DATA FLOW in React
+++++++++++++++++++

/welcome GET 1. Server gets Request & it sends HTML as response 2. HTML makes request for file bundle.js 3. bundle.js file comes from the second server that we run. (node bundle-server.js) 4. bundle.js contains all REACT and bundle.js activates REACT. 5. When bundle.js runs and available in browser then our REACT code runs. 6. ReactDOM.render renders a component onscreen. If it is no not present, we dont get any bugs but nothing is rendered on the screen.

Registration Flow:
+++++++++++++++++

F.E -> user enters all input data(name, email,id etc) in Registration
user clicks register button and sends axios http POST request to server(index.js)

1. FE -> Server /post register
2. server -> DB
3. DB -> Server
4. Server -> FE

    ```

    ```
