
<br>

### Remote Development

Build via

```shell
docker build . --file .devcontainer/Dockerfile -t dynamic
```

Launch an interactive environment via

```shell
docker run --rm -i -t -p 8080:80 -w /app 
  --mount type=bind,src="$(pwd)",target=/app 
    -v ~/.aws:/root/.aws dynamic
```

Subsequently, launch a web server via

```shell
nginx -g 'daemon off;'
```

The URL is

```text
http://localhost:8080
```

Note, for an immediate web server launch $\rightarrow$

```shell
docker run --rm -i -t -p 8080:80 -w /app 
  --mount type=bind,src="$(pwd)",target=/app 
    dynamic nginx -g 'daemon off;'
```

<br>
<br>

### Graphing

The date & time formats of High Charts

* [date & time formats](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat)

<br>
<br>

### References

NGINX
* [docker hub](https://hub.docker.com/_/nginx)
* [docker nginx](https://toxigon.com/setting-up-nginx-with-docker)
* [docker nginx](https://www.uptimia.com/questions/how-to-run-nginx-in-the-foreground-within-a-docker-container#implementing-the-solution-in-docker)
* [extra help](https://itnext.io/dockerizing-modern-web-apps-cd9667eebf44)
* [more](https://www.socketxp.com/iot/remote-access-nginx-web-server-from-internet/)
* [nginx -g 'daemon off;'](https://www.thecoderscamp.com/nginx-g-daemon-off/)
* [Dockerfile](https://github.com/devasthali-os/nginx-base/blob/master/Dockerfile)
* [conf](https://nginx.org/en/docs/beginners_guide.html#conf_structure)
* [MIME (Multipurpose Internet Mail Extensions) Types](https://server.hk/blog/14461/)
* [MIME Types](https://www.slingacademy.com/article/nginx-mime-types-the-complete-guide/)
* [load error example](https://www.slingacademy.com/article/nginx-error-cannot-load-css-js-files/)

<br>

vim & vi
* [vi](https://linuxsimply.com/cheat-sheets/vi/)
* [vim](https://vim.rtorr.com)
* [vim](https://www.redhat.com/en/blog/beginners-guide-vim)

<br>
<br>

<br>
<br>

<br>
<br>

<br>
<br>
