import CallToActionCSS from './css/CallToActionCSS';
import CardCSS from './css/CardCSS';
import ChangeNetworkFeeDialogCSS from './css/ChangeNetworkFeeDialogCSS';
import CircularButtonCSS from './css/CircularButtonCSS';
import CircularIconCSS from './css/CircularIconCSS';
import DialogCSS from './css/DialogCSS';
import InsideContainerCSS from './css/InsideContainerCSS';
import PaddingCSS from './css/PaddingCSS';
import PaymentCSS from './css/PaymentCSS';
import PaymentDialogCSS from './css/PaymentDialogCSS';
import PoweredByCSS from './css/PoweredByCSS';
import RangeSliderCSS from './css/RangeSliderCSS';
import SearchCSS from './css/SearchCSS';
import SkeletonCSS from './css/SkeletonCSS';
import StackedDialogCSS from './css/StackedDialogCSS';
import TableCSS from './css/TableCSS';
import TextButtonCSS from './css/TextButtonCSS';
import TipCSS from './css/TipCSS';
import TokenListCSS from './css/TokenListCSS';
import TypographyCSS from './css/TypographyCSS';

const CSS = [
  `
    /* RESET START */
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }
    /* RESET END */

    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    html {
      font-size: 100%;
    }

    button {
      border: 0;
      background: none;
      outline: none;
    }
  `,
  InsideContainerCSS,
  DialogCSS,
  SkeletonCSS,
  CircularButtonCSS,
  CircularIconCSS,
  TipCSS,
  TokenListCSS,
  SearchCSS,
  TextButtonCSS,
  StackedDialogCSS,
  PaymentCSS,
  CallToActionCSS,
  PoweredByCSS,
  PaymentDialogCSS,
  TypographyCSS,
  PaddingCSS,
  CardCSS,
  TableCSS,
  RangeSliderCSS,
  ChangeNetworkFeeDialogCSS,
].join("\n");

export default CSS;
