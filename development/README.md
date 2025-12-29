
<br>

### Remote Development

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

<br>
<br>

<br>
<br>

<br>
<br>
