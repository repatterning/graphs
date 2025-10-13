
<br>

### Notes

Model development considerations:

* The mechanics, behaviour, of the response time series.
* The behaviour of features that are predictive of the response.  A known predictor is rainfall.  Unfortunately, appropriate contemporaneous rainfall measures do not yet exist.
* Model parameters priors.

And

* [Structural Time Series Modelling](https://blog.tensorflow.org/2019/03/structural-time-series-modeling-in.html)
* [Linear Gaussian State Space Model](https://github.com/tensorflow/probability/blob/v0.23.0/tensorflow_probability/python/distributions/linear_gaussian_ssm.py)
* [sts.Seasonal](https://github.com/tensorflow/probability/blob/v0.23.0/tensorflow_probability/python/sts/components/seasonal.py)

Text

* [Forecasting, Structural Time Series Models and the Kalman Filter](https://www.cambridge.org/core/books/forecasting-structural-time-series-models-and-the-kalman-filter/CE5E112570A56960601760E786A5E631)


The date & time formats of High Charts

* [date & time formats](https://api.highcharts.com/class-reference/Highcharts.Time#dateFormat)


<br>
<br>


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
