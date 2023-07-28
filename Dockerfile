# Use the Nginx base image from Docker Hub
FROM nginx

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your HTML files and scripts to the Nginx document root
COPY html_files /usr/share/nginx/html

# Expose port 80 to allow access to the Nginx web server
EXPOSE 80
