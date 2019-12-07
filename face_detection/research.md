### Mobilenet v2
The mobilenet does a resize on the input image. The model used
in the project has been trained for 300x300 images. After some
tests, I obtained the following results:
```
300x300: 15.95 FPS
600x600: 15.70 FPS
720x720: 15.55 FPS
1280x718: 14.77 FPS
``` 

In all cases, I manually resized the image before passing it to
tensorflow, except the last case, which has teh default
dimensions.

As a conclusion, I should read the pictures in a 1:1 format.

Detailed mobilenet links:
1.  https://towardsdatascience.com/review-mobilenetv2-light-weight-model-image-classification-8febb490e61c
1. https://github.com/keras-team/keras-applications/blob/master/keras_applications/mobilenet_v2.py
1. https://keras.rstudio.com/reference/application_mobilenet_v2.html
1. https://github.com/tensorflow/models/issues/1876
