
<br>

### Notes

Model development considerations:

* The mechanics, behaviour, of the response time series.
* The behaviour of features that are predictive of the response.  A known predictor is rainfall.  Unfortunately, appropriate contemporaneous rainfall measures do not yet exist.
* Model parameters priors.


### Server

Launch an interactive environment via

```shell
docker run --rm -i -t -p 8080:80 -w /app 
  --mount type=bind,src="$(pwd)",target=/app 
    dynamic
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

<br>
<br>

<br>
<br>

<br>
<br>