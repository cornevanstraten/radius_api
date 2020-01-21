---radius_RESTful_API---


2nd iteration of the radius (learnradius.com) initiative.
API can be accessed at https://radiusapi.herokuapp.com

Learnradius.com is a prototype of an Airbnb-style open marketplace that would allow you to find skilled people around you, so you could learn from them directly. Featuring:

* Accounts and permission structures
* Authentication with JWT (JSON Web Tokens) and bcrypt
* Image recognition and manipulation with Cloudinary
* Geocoding plain text addresses with Google Maps
* geoSearch using MongoDB $geoNear operator

Whereas the initial iteration was a monolithic application, the radius_RESTful_API separates the backend logic from the frontend entirely, allowing for a headless application that can exist independently of frontends.

Find a video walkthrough of this API at
https://www.youtube.com/watch?v=UyEpmAQd2-Y
