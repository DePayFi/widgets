export default function(){
  return `

    .Skeleton {
      background: rgb(230,230,230) !important;
      border-radius: 99rem;
      border: 1px solid transparent;
      box-shadow: none !important;
      display: inline-block;
      height: 1rem;
      overflow: hidden;
      position: relative;
      width: 100%;
    }

    @keyframes SkeletonBackgroundAnimation {
        from {
            left: -20vw;
        }
        to   {
            left: +20vw;
        }
    }

    .SkeletonBackground {
      animation: SkeletonBackgroundAnimation 2.5s ease infinite;
      background: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
      position: absolute;
      width: 200px;
      height: 100%;
    }
  `;
}
