
FROM node:alpine as build
# set working directory
# this is the working folder in the container
# from which the app will be running from
WORKDIR /frontend
COPY . /frontend
RUN yarn
#build the project for production
RUN yarn build
# set up production environment
# the base image for this is an alpine based nginx image
FROM nginx:alpine
# copy the build folder from react to the root of nginx (www)
COPY --from=build /frontend/build /usr/share/nginx/html
# --------- only for those using react router ----------
# if you are using react router
# you need to overwrite the default nginx configurations
# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx/nginx.conf /etc/nginx/conf.d
# --------- /only for those using react router ----------
# expose port 80 to the outer world
EXPOSE 80
# start nginx
CMD ["nginx", "-g", "daemon off;"]