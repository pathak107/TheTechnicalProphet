# The Technical Prophet is the official blog website of ISTE Manipal student's chapter

# Visit the link https://blog.istemanipal.com 

## The website is made by me and blog posts and contents are handled by content head of our club.
The website uses NodeJs and mongoDB for backend. For the frontend it uses a template by colorlib.
Website has a login functionality from where admin can add new posts. For adding posts website uses a WYSIWYG editor called quilljs.
It is fully seo optimized and also uses nodemailer which sends mail to all the registered users.

### Features-
1. Uses nodejs and mongodb as backend
1. Ejs templating to serve data to front end from APIs
1. WYSIWYG editor
1. Seo open graph tags for facebook and twitter
1. Embed option in blog post creation for youtube videos and images.
1. Nodemailer to mail all the subscribed users.
1. Rest API for mobile app of iste to provide information about blog posts in json format.
1. Uses mongoDB to store sessions
1. Added editing blogs functionality
1. Added number of views on blog posts in the REST API for mobile app
1. Added google analytics
1. Added image resizer tool in WYSIWYG editor
1. Used pm2 module for autorestart the app on server and set env to production for caching.

### Functionality to add-
1. Pagination
1. Ensure proper working of nodemailer
1. Removing the main banner from every page except home page.
1. Implement Quill custom css classes for proper rendering of blog posts.
1. Implement categories route to show different posts depending upon category.

Whenever in production mode-
change http to https and change session's secure parameter to true

