export default `
  @media (max-width: 767px)  {
    .hidden-xs {
      display: none;
    }
    .col-xs-0 {
      display: none;
    }
  }
  @media (min-width: 768px) and (max-width: 991px)  {
    .hidden-sm {
      display: none;
    }
    .col-sm-0 {
      display: none;
    }
  }
  @media (min-width: 992px) and (max-width: 1199px)  {
    .hidden-md {
      display: none;
    }
    .col-md-0 {
      display: none;
    }
  }
  @media (min-width: 1200px) {
    .hidden-lg {
      display: none;
    }
    .col-lg-0 {
      display: none;
    }
  }
  .limited {
    width: 95%;
  }
  @media (min-width: 992px) {
    .limited {
      width: 960px;
    }
  }
  .col-xs-12 {
    width: 100%;
  }
  .col-xs-11 {
    width: 91.66666667%;
  }
  .col-xs-10 {
    width: 83.33333333%;
  }
  .col-xs-9 {
    width: 75%;
  }
  .col-xs-8 {
    width: 66.66666667%;
  }
  .col-xs-7 {
    width: 58.33333333%;
  }
  .col-xs-6 {
    width: 50%;
  }
  .col-xs-5 {
    width: 41.66666667%;
  }
  .col-xs-4 {
    width: 33.33333333%;
  }
  .col-xs-3 {
    width: 25%;
  }
  .col-xs-2 {
    width: 16.66666667%;
  }
  .col-xs-1 {
    width: 8.33333333%;
  }
  @media (min-width: 768px) {
    .col-sm-12 {
      width: 100%;
    }
    .col-sm-11 {
      width: 91.66666667%;
    }
    .col-sm-10 {
      width: 83.33333333%;
    }
    .col-sm-9 {
      width: 75%;
    }
    .col-sm-8 {
      width: 66.66666667%;
    }
    .col-sm-7 {
      width: 58.33333333%;
    }
    .col-sm-6 {
      width: 50%;
    }
    .col-sm-5 {
      width: 41.66666667%;
    }
    .col-sm-4 {
      width: 33.33333333%;
    }
    .col-sm-3 {
      width: 25%;
    }
    .col-sm-2 {
      width: 16.66666667%;
    }
    .col-sm-1 {
      width: 8.33333333%;
    }
  }
  @media (min-width: 992px) {
    .col-md-12 {
      width: 100%;
    }
    .col-md-11 {
      width: 91.66666667%;
    }
    .col-md-10 {
      width: 83.33333333%;
    }
    .col-md-9 {
      width: 75%;
    }
    .col-md-8 {
      width: 66.66666667%;
    }
    .col-md-7 {
      width: 58.33333333%;
    }
    .col-md-6 {
      width: 50%;
    }
    .col-md-5 {
      width: 41.66666667%;
    }
    .col-md-4 {
      width: 33.33333333%;
    }
    .col-md-3 {
      width: 25%;
    }
    .col-md-2 {
      width: 16.66666667%;
    }
    .col-md-1 {
      width: 8.33333333%;
    }
  }
  @media (min-width: 1200px) {
    .col-lg-12 {
      width: 100%;
    }
    .col-lg-11 {
      width: 91.66666667%;
    }
    .col-lg-10 {
      width: 83.33333333%;
    }
    .col-lg-9 {
      width: 75%;
    }
    .col-lg-8 {
      width: 66.66666667%;
    }
    .col-lg-7 {
      width: 58.33333333%;
    }
    .col-lg-6 {
      width: 50%;
    }
    .col-lg-5 {
      width: 41.66666667%;
    }
    .col-lg-4 {
      width: 33.33333333%;
    }
    .col-lg-3 {
      width: 25%;
    }
    .col-lg-2 {
      width: 16.66666667%;
    }
    .col-lg-1 {
      width: 8.33333333%;
    }
  }
  amp-img {
    max-width: 100%;
    max-height: 100%;
  }
  amp-img.fill img {
    object-fit: cover;
  }
  amp-img.circle {
    border-radius: 50%;
  }
  .image-responsive {
    background-size: contain !important;
  }
  .image-outer-wrapper {
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
  a.no-decoration:hover {
    text-decoration: none;
  }
  .button-wrapper {
    display: flex;
    width: max-content;
  }
  .button-wrapper.button-full {
    width: 100%;
  }
  .button {
    display: flex;
  }
  .button a:hover {
    text-decoration: none;
  }
  .button:focus {
    outline: none;
  }
  .button:hover {
    opacity: 0.8;
  }
`;
