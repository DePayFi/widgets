export default (style)=>{
  return(`
        
    .Skeleton {
      background: ${style.colors.background} !important;
      background: color-mix(in srgb, ${style.colors.background} 95%, ${style.colors.mixActive} 5%) !important;
      border: 0px solid transparent !important;
      box-shadow: none !important;
      cursor: inherit !important;
      line-height: 0;
      overflow: hidden;
      position: relative;
    }

    .Card .Skeleton {
      background: ${style.colors.cardBackground} !important;
      background: color-mix(in srgb, ${style.colors.cardBackground} 95%, ${style.colors.mixActive} 5%) !important;
    }

    .Card .Skeleton .SkeletonBackground {
      background: linear-gradient(to right, transparent 0%, ${style.colors.cardBackground} 50%, transparent 100%);
      background: linear-gradient(to right, transparent 0%, color-mix(in srgb, ${style.colors.cardBackground} 90%, ${style.colors.mixActive} 10%) 50%, transparent 100%);
    }

    @keyframes SkeletonBackgroundAnimation {
      from {
        left: -500px;
      }
      to   {
        left: +120%;
      }
    }

    .SkeletonBackground {
      animation: 2s SkeletonBackgroundAnimation 0.2s ease infinite;
      background: linear-gradient(to right, transparent 0%, ${style.colors.background} 50%, transparent 100%);
      background: linear-gradient(to right, transparent 0%, color-mix(in srgb, ${style.colors.background} 80%, ${style.colors.mixActive} 20%) 50%, transparent 100%);
      height: 100%;
      left: -140%;
      position: absolute;
      top: 0;
      width: 400px;
    }

    .SkeletonWrapper {
      line-height: 0;
    }
  `)
}
