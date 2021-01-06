export default `
  * {
    box-sizing: border-box;
  }
  [data-class~="hidden"] {
    display: none;
  }
  @media (max-width: 767px)  {
    [data-class~="hidden-xs"] {
      display: none;
    }
    [data-class~="col-xs-0"] {
      display: none;
    }
  }
  @media (min-width: 768px) and (max-width: 991px)  {
    [data-class~="hidden-sm"] {
      display: none;
    }
    [data-class~="col-sm-0"] {
      display: none;
    }
  }
  @media (min-width: 992px) and (max-width: 1199px)  {
    [data-class~="hidden-md"] {
      display: none;
    }
    [data-class~="col-md-0"] {
      display: none;
    }
  }
  @media (min-width: 1200px) {
    [data-class~="hidden-lg"] {
      display: none;
    }
    [data-class~="col-lg-0"] {
      display: none;
    }
  }
  [data-class~="limited"] {
    width: 95%;
  }
  @media (min-width: 992px) {
    [data-class~="limited"] {
      width: 960px;
    }
  }
  [data-class~="col-xs-12"] {
    width: 100%;
  }
  [data-class~="col-xs-11"] {
    width: 91.66666667%;
  }
  [data-class~="col-xs-10"] {
    width: 83.33333333%;
  }
  [data-class~="col-xs-9"] {
    width: 75%;
  }
  [data-class~="col-xs-8"] {
    width: 66.66666667%;
  }
  [data-class~="col-xs-7"] {
    width: 58.33333333%;
  }
  [data-class~="col-xs-6"] {
    width: 50%;
  }
  [data-class~="col-xs-5"] {
    width: 41.66666667%;
  }
  [data-class~="col-xs-4"] {
    width: 33.33333333%;
  }
  [data-class~="col-xs-3"] {
    width: 25%;
  }
  [data-class~="col-xs-2"] {
    width: 16.66666667%;
  }
  [data-class~="col-xs-1"] {
    width: 8.33333333%;
  }
  @media (min-width: 768px) {
    [data-class~="col-sm-12"] {
      width: 100%;
    }
    [data-class~="col-sm-11"] {
      width: 91.66666667%;
    }
    [data-class~="col-sm-10"] {
      width: 83.33333333%;
    }
    [data-class~="col-sm-9"] {
      width: 75%;
    }
    [data-class~="col-sm-8"] {
      width: 66.66666667%;
    }
    [data-class~="col-sm-7"] {
      width: 58.33333333%;
    }
    [data-class~="col-sm-6"] {
      width: 50%;
    }
    [data-class~="col-sm-5"] {
      width: 41.66666667%;
    }
    [data-class~="col-sm-4"] {
      width: 33.33333333%;
    }
    [data-class~="col-sm-3"] {
      width: 25%;
    }
    [data-class~="col-sm-2"] {
      width: 16.66666667%;
    }
    [data-class~="col-sm-1"] {
      width: 8.33333333%;
    }
  }
  @media (min-width: 992px) {
    [data-class~="col-md-12"] {
      width: 100%;
    }
    [data-class~="col-md-11"] {
      width: 91.66666667%;
    }
    [data-class~="col-md-10"] {
      width: 83.33333333%;
    }
    [data-class~="col-md-9"] {
      width: 75%;
    }
    [data-class~="col-md-8"] {
      width: 66.66666667%;
    }
    [data-class~="col-md-7"] {
      width: 58.33333333%;
    }
    [data-class~="col-md-6"] {
      width: 50%;
    }
    [data-class~="col-md-5"] {
      width: 41.66666667%;
    }
    [data-class~="col-md-4"] {
      width: 33.33333333%;
    }
    [data-class~="col-md-3"] {
      width: 25%;
    }
    [data-class~="col-md-2"] {
      width: 16.66666667%;
    }
    [data-class~="col-md-1"] {
      width: 8.33333333%;
    }
  }
  @media (min-width: 1200px) {
    [data-class~="col-lg-12"] {
      width: 100%;
    }
    [data-class~="col-lg-11"] {
      width: 91.66666667%;
    }
    [data-class~="col-lg-10"] {
      width: 83.33333333%;
    }
    [data-class~="col-lg-9"] {
      width: 75%;
    }
    [data-class~="col-lg-8"] {
      width: 66.66666667%;
    }
    [data-class~="col-lg-7"] {
      width: 58.33333333%;
    }
    [data-class~="col-lg-6"] {
      width: 50%;
    }
    [data-class~="col-lg-5"] {
      width: 41.66666667%;
    }
    [data-class~="col-lg-4"] {
      width: 33.33333333%;
    }
    [data-class~="col-lg-3"] {
      width: 25%;
    }
    [data-class~="col-lg-2"] {
      width: 16.66666667%;
    }
    [data-class~="col-lg-1"] {
      width: 8.33333333%;
    }
  }
  amp-img {
    max-width: 100%;
    max-height: 100%;
  }
  amp-img.fill img,
  amp-img[data-class~="fill"] img {
    object-fit: cover;
  }
  amp-img.circle,
  amp-img[data-class~="circle"] {
    border-radius: 50%;
  }
  img[data-class~="image-cover"] {
    object-fit: cover;
  }
  img[data-class~="image-responsive"] {
    background-size: contain !important;
  }
  [data-class~="image-outer-wrapper"] {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: inline-block;
    line-height: 0;
    padding: 0;
    margin: 0;
  }
  .fa {
    color: inherit;
  }
  a {
    text-decoration: none;
    transition: transform .25s ease-in-out;
  }
  a:hover {
    text-decoration: underline;
    opacity: 0.8;
  }
  a[data-class~="no-decoration"]:hover {
    text-decoration: none;
  }
  [data-class~="button-wrapper"] {
    display: flex;
  }
  [data-class~="button-wrapper"][data-class~="button-auto"] {
    width: max-content;
  }
  [data-class~="button-wrapper"][data-class~="button-full"] {
    width: 100%;
  }
  [data-class~="button"] {
    display: flex;
  }
  [data-class~="button"] a:hover {
    text-decoration: none;
  }
  [data-class~="button"]:focus {
    outline: none;
  }
  [data-class~="button"]:hover {
    opacity: 0.8;
  }
  [data-class~="TextInput"] {
    outline: none;
  }
`;
