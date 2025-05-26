import { wallets, getWallets } from '@depay/web3-wallets';
import Blockchains from '@depay/web3-blockchains';
import React, { useRef, useEffect, useCallback, useState, useContext, useMemo } from 'react';
import copy from '@uiw/copy-to-clipboard';
import { NavigateStackContext, ReactDialogStack } from '@depay/react-dialog-stack';
import QRCodeStyling from 'qr-code-styling';
import Fuse from 'fuse.js';
import { useVirtualizer } from '@tanstack/react-virtual';
import ReactDOM from 'react-dom';
import { ReactShadowDOM } from '@depay/react-shadow-dom';
import { setProviderEndpoints, request, getProvider } from '@depay/web3-client';
import { Currency } from '@depay/local-currency';
import { verify } from '@depay/js-verify-signature-web';
import Token from '@depay/web3-tokens';
import { Decimal } from 'decimal.js';
import { ethers } from 'ethers';
import { route, routers } from '@depay/web3-payments';
import { TokenImage } from '@depay/react-token-image';
import { PublicKey } from '@depay/solana-web3.js';

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var supported = ['ethereum', 'bsc', 'polygon', 'solana', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain'];
supported.evm = ['ethereum', 'bsc', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche', 'gnosis', 'worldchain'];
supported.svm = ['solana'];

var _wallets$CoinbaseEVM, _wallets$CoinbaseEVM$, _wallets$MetaMask, _wallets$MetaMask$inf, _wallets$PhantomSVM, _wallets$PhantomSVM$i, _wallets$TrustEVM, _wallets$TrustEVM$inf, _wallets$Binance, _wallets$Binance$info, _wallets$CryptoCom, _wallets$CryptoCom$in, _wallets$WorldApp, _wallets$WorldApp$inf, _wallets$Coin98EVM, _wallets$Coin98EVM$in, _wallets$BraveEVM, _wallets$BraveEVM$inf, _wallets$MagicEdenEVM, _wallets$MagicEdenEVM2, _wallets$Rabby, _wallets$Rabby$info, _wallets$Backpack, _wallets$Backpack$inf, _wallets$Glow, _wallets$Glow$info, _wallets$Solflare, _wallets$Solflare$inf, _wallets$OKXEVM, _wallets$OKXEVM$info, _wallets$HyperPay, _wallets$HyperPay$inf, _wallets$WindowEthere, _wallets$WindowEthere2, _Blockchains$solana, _wallets$WindowSolana, _wallets$WindowSolana2;
var allWallets = [{
  "name": "Coinbase",
  "extensions": ["CoinbaseEVM", "CoinbaseSVM"],
  "desktop": {
    "qr": "WalletLink"
  },
  "mobile": {
    "ios": {
      "native": "cbwallet://dapp",
      "universal": "https://go.cb-w.com/dapp",
      "open": function open() {
        return "cbwallet://dapp?url=".concat(encodeURIComponent(window.location.toString()));
      }
    },
    "android": {
      "native": "cbwallet://dapp",
      "universal": "https://go.cb-w.com/dapp",
      "open": function open() {
        return "https://go.cb-w.com/dapp?cb_url=".concat(encodeURIComponent(window.location.toString()));
      }
    }
  },
  "logo": (_wallets$CoinbaseEVM = wallets.CoinbaseEVM) === null || _wallets$CoinbaseEVM === void 0 ? void 0 : (_wallets$CoinbaseEVM$ = _wallets$CoinbaseEVM.info) === null || _wallets$CoinbaseEVM$ === void 0 ? void 0 : _wallets$CoinbaseEVM$.logo,
  "blockchains": _toConsumableArray(supported),
  "colors": {
    "primary": "#0153ff",
    "secondary": "#ffffff"
  }
}, {
  "name": "MetaMask",
  "extension": "MetaMask",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "metamask:",
      "universal": "https://metamask.app.link",
      "qr": "WalletConnectV2",
      "connect": "WalletConnectV2"
    },
    "android": {
      "native": "metamask:",
      "universal": "https://metamask.app.link",
      "qr": "WalletConnectV2",
      "connect": "WalletConnectV2"
    }
  },
  "logo": (_wallets$MetaMask = wallets.MetaMask) === null || _wallets$MetaMask === void 0 ? void 0 : (_wallets$MetaMask$inf = _wallets$MetaMask.info) === null || _wallets$MetaMask$inf === void 0 ? void 0 : _wallets$MetaMask$inf.logo,
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#ff8d5d",
    "secondary": "#661800"
  }
}, {
  "name": "Phantom",
  "extensions": ["PhantomSVM", "PhantomEVM"],
  "desktop": {
    "solanaPay": true,
    "qr": function qr() {
      return "phantom://browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
    }
  },
  "mobile": {
    "ios": {
      "native": "phantom:",
      "open": function open() {
        return "https://phantom.app/ul/browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
      },
      "qr": function qr() {
        return "phantom://browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
      },
      "solanaPay": true
    },
    "android": {
      "native": "phantom:",
      "connect": "SolanaMobileWalletAdapter",
      "qr": function qr() {
        return "phantom://browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
      },
      "solanaPay": true
    }
  },
  "logo": (_wallets$PhantomSVM = wallets.PhantomSVM) === null || _wallets$PhantomSVM === void 0 ? void 0 : (_wallets$PhantomSVM$i = _wallets$PhantomSVM.info) === null || _wallets$PhantomSVM$i === void 0 ? void 0 : _wallets$PhantomSVM$i.logo,
  "blockchains": _toConsumableArray(supported),
  "colors": {
    "primary": "#ab9ef2",
    "secondary": "#252525",
    "background": "#252525"
  }
}, {
  "name": "Trust",
  "extensions": ["TrustEVM", "TrustSVM"],
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "trust:",
      "universal": "https://link.trustwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "trust:",
      "universal": "https://link.trustwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": (_wallets$TrustEVM = wallets.TrustEVM) === null || _wallets$TrustEVM === void 0 ? void 0 : (_wallets$TrustEVM$inf = _wallets$TrustEVM.info) === null || _wallets$TrustEVM$inf === void 0 ? void 0 : _wallets$TrustEVM$inf.logo,
  "blockchains": _toConsumableArray(supported),
  "colors": {
    "primary": "#0700ff",
    "secondary": "#48ff91",
    "background": "#ffffff"
  }
}, {
  "name": "Binance",
  "extension": "Binance",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bnc://app.binance.com/cedefi/",
      "universal": "https://app.binance.com/cedefi",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bnc://app.binance.com/cedefi/",
      "universal": "https://app.binance.com/cedefi",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": (_wallets$Binance = wallets.Binance) === null || _wallets$Binance === void 0 ? void 0 : (_wallets$Binance$info = _wallets$Binance.info) === null || _wallets$Binance$info === void 0 ? void 0 : _wallets$Binance$info.logo,
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#1e2024",
    "secondary": "#f3ba2f"
  }
}, {
  "name": "Crypto.com Onchain",
  "extension": "CryptoCom",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "dfw://",
      "universal": "https://wallet.crypto.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "dfw://",
      "universal": "https://wallet.crypto.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": (_wallets$CryptoCom = wallets.CryptoCom) === null || _wallets$CryptoCom === void 0 ? void 0 : (_wallets$CryptoCom$in = _wallets$CryptoCom.info) === null || _wallets$CryptoCom$in === void 0 ? void 0 : _wallets$CryptoCom$in.logo,
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#03316c",
    "secondary": "#ffffff",
    "background": "#245594"
  }
}, {
  "name": "World App",
  "extension": "WorldApp",
  "logo": (_wallets$WorldApp = wallets.WorldApp) === null || _wallets$WorldApp === void 0 ? void 0 : (_wallets$WorldApp$inf = _wallets$WorldApp.info) === null || _wallets$WorldApp$inf === void 0 ? void 0 : _wallets$WorldApp$inf.logo,
  "autoSelect": true,
  // if available
  "blockchains": ["worldchain"],
  "colors": {
    "primary": "#000000",
    "secondary": "#ffffff"
  }
}, {
  "name": "Coin98",
  "extensions": ["Coin98EVM", "Coin98SVM"],
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "coin98:",
      "universal": "https://coin98.services",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "coin98:",
      "universal": "https://coin98.services",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": (_wallets$Coin98EVM = wallets.Coin98EVM) === null || _wallets$Coin98EVM === void 0 ? void 0 : (_wallets$Coin98EVM$in = _wallets$Coin98EVM.info) === null || _wallets$Coin98EVM$in === void 0 ? void 0 : _wallets$Coin98EVM$in.logo,
  "blockchains": _toConsumableArray(supported),
  "colors": {
    "primary": "#252525",
    "secondary": "#d9b432"
  }
}, {
  "name": "Brave",
  "extensions": ["BraveEVM", "BraveSVM"],
  "logo": (_wallets$BraveEVM = wallets.BraveEVM) === null || _wallets$BraveEVM === void 0 ? void 0 : (_wallets$BraveEVM$inf = _wallets$BraveEVM.info) === null || _wallets$BraveEVM$inf === void 0 ? void 0 : _wallets$BraveEVM$inf.logo,
  "blockchains": _toConsumableArray(supported),
  "colors": {
    "primary": "#ffffff",
    "secondary": "#f05a22"
  }
}, {
  "name": "Magic Eden",
  "extensions": ["MagicEdenEVM", "MagicEdenSVM"],
  "logo": (_wallets$MagicEdenEVM = wallets.MagicEdenEVM) === null || _wallets$MagicEdenEVM === void 0 ? void 0 : (_wallets$MagicEdenEVM2 = _wallets$MagicEdenEVM.info) === null || _wallets$MagicEdenEVM2 === void 0 ? void 0 : _wallets$MagicEdenEVM2.logo,
  "blockchains": _toConsumableArray(supported),
  "colors": {
    "primary": "#070c34",
    "secondary": "#ff8c00"
  }
}, {
  "name": "Rainbow",
  "extension": "Rainbow",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "rainbow:",
      "universal": "https://rnbwapp.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "rainbow:",
      "universal": "https://rnbwapp.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/rainbow.jpg",
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#092b70",
    "secondary": "#ffde01"
  }
}, {
  "name": "Uniswap",
  "extension": "Uniswap",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "uniswap:",
      "universal": "https://uniswap.org/app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "uniswap:",
      "universal": "https://uniswap.org/app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/uniswap_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#fffbfe",
    "secondary": "#f43ddf"
  }
}, {
  "name": "Safe",
  "desktop": {
    "qr": "WalletConnectV2",
    "copyLink": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "safe",
      "universal": "https://app.safe.global",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "safe",
      "universal": "https://app.safe.global",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/safe.jpg",
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#10ff80",
    "secondary": "#121312"
  }
}, {
  "name": "Rabby",
  "extension": "Rabby",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": (_wallets$Rabby = wallets.Rabby) === null || _wallets$Rabby === void 0 ? void 0 : (_wallets$Rabby$info = _wallets$Rabby.info) === null || _wallets$Rabby$info === void 0 ? void 0 : _wallets$Rabby$info.logo,
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#5c48ed",
    "secondary": "#a6a6ff"
  }
}, {
  "name": "Kraken",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "krakenwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "krakenwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/kraken.jpg",
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#7a3ef5",
    "secondary": "#f3cefc"
  }
}, {
  "name": "Backpack",
  "extension": "Backpack",
  "desktop": {
    "solanaPay": true,
    "qr": function qr() {
      return "backpack://ul/v1/browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
    }
  },
  "mobile": {
    "ios": {
      "open": function open() {
        return "backpack://ul/v1/browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
      }
    },
    "android": {
      "open": function open() {
        return "backpack://ul/v1/browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
      }
    }
  },
  "logo": (_wallets$Backpack = wallets.Backpack) === null || _wallets$Backpack === void 0 ? void 0 : (_wallets$Backpack$inf = _wallets$Backpack.info) === null || _wallets$Backpack$inf === void 0 ? void 0 : _wallets$Backpack$inf.logo,
  "blockchains": _toConsumableArray(supported.svm),
  "colors": {
    "primary": "#e23e3f",
    "secondary": "#252525",
    "background": "#252525"
  }
}, {
  "name": "Glow",
  "extension": "Glow",
  "desktop": {
    "qr": function qr() {
      return window.location.toString();
    }
  },
  "mobile": {
    "ios": {
      "qr": function qr() {
        return window.location.toString();
      }
    },
    "android": {
      "connect": "SolanaMobileWalletAdapter",
      "qr": function qr() {
        return window.location.toString();
      }
    }
  },
  "logo": (_wallets$Glow = wallets.Glow) === null || _wallets$Glow === void 0 ? void 0 : (_wallets$Glow$info = _wallets$Glow.info) === null || _wallets$Glow$info === void 0 ? void 0 : _wallets$Glow$info.logo,
  "blockchains": _toConsumableArray(supported.svm),
  "colors": {
    "primary": "#aa35d8",
    "secondary": "#f5e4fb"
  }
}, {
  "name": "Solflare",
  "extension": "Solflare",
  "desktop": {
    "solanaPay": true
  },
  "mobile": {
    "ios": {
      "native": "solflare:",
      "open": function open() {
        return "https://solflare.com/ul/v1/browse/".concat(encodeURIComponent(window.location.toString()), "?ref=").concat(encodeURIComponent(window.location.origin.toString()));
      },
      "universal": "https://solflare.com/ul",
      "solanaPay": true
    },
    "android": {
      "native": "solflare:",
      "universal": "https://solflare.com/ul",
      "connect": "SolanaMobileWalletAdapter",
      "solanaPay": true
    }
  },
  "logo": (_wallets$Solflare = wallets.Solflare) === null || _wallets$Solflare === void 0 ? void 0 : (_wallets$Solflare$inf = _wallets$Solflare.info) === null || _wallets$Solflare$inf === void 0 ? void 0 : _wallets$Solflare$inf.logo,
  "blockchains": _toConsumableArray(supported.svm),
  "colors": {
    "primary": "#fef046",
    "secondary": "#03050b"
  }
}, {
  "name": "Family",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "familywallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "familywallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/family.jpg",
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#12bec1",
    "secondary": "#d7f3ff"
  }
}, {
  "name": "imToken",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "imtokenv2:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "imtokenv2:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/imtoken.jpg",
  "blockchains": _toConsumableArray(supported.evm),
  "colors": {
    "primary": "#037ab6",
    "secondary": "#ffffff"
  }
}, {
  "name": "MEW wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "mewwallet:",
      "universal": "https://mewwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "mewwallet:",
      "universal": "https://mewwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/mew_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ONTO",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ontoprovider:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ontoprovider:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/onto.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Zerion",
  "desktop": {
    "native": "zerion://",
    "qr": "WalletConnectV2",
    "connect": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "zerion://",
      "universal": "https://wallet.zerion.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "zerion://",
      "universal": "https://wallet.zerion.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/zerion.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Spot",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "spot://",
      "universal": "https://spot.so",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "spot://",
      "universal": "https://spot.so",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/spot.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "BitGet (BitKeep)",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bitget://",
      "universal": "https://bkapp.vip",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bitget://",
      "universal": "https://bkapp.vip",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bitget.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Unstoppable Domains",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://unstoppabledomains.com/mobile",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://unstoppabledomains.com/mobile",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/unstoppable_domains.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Omni",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "omni:",
      "universal": "https://links.omni.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "omni:",
      "universal": "https://links.omni.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/omni.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "KEYRING PRO",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "keyring:",
      "universal": "https://keyring.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "keyring:",
      "universal": "https://keyring.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/keyring_pro.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "TP Wallet (TokenPocket)",
  "extension": "TokenPocket",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "tpoutside:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "tpoutside:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/token_pocket.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "BitPay",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bitpay:",
      "universal": "https://link.bitpay.com/wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bitpay:",
      "universal": "https://link.bitpay.com/wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bitpay.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "MathWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "mathwallet:",
      "universal": "https://www.mathwallet.org",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "mathwallet:",
      "universal": "https://www.mathwallet.org",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/math_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Ledger Live",
  "desktop": {
    "native": "ledgerlive:",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2",
    "copyLink": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ledgerlive:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ledgerlive:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/ledger_live.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "1inch Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "oneinch://",
      "universal": "https://wallet.1inch.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "oneinch://",
      "universal": "https://wallet.1inch.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/1inch_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "iToken Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "huobiwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "huobiwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/i_token_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Huddln",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "huddln:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "huddln:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/huddln.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Eidoo",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "eidoo:",
      "universal": "https://eidoo.io/crypto-wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "eidoo:",
      "universal": "https://eidoo.io/crypto-wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/eidoo.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Timeless Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "timeless-wallet:",
      "universal": "https://timelesswallet.xyz",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "timeless-wallet:",
      "universal": "https://timelesswallet.xyz",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/timeless.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "CoolWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "coolwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "coolwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/cool_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Unstoppable Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "unstoppable.money://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "unstoppable.money://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/unstoppable.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "AlphaWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "awallet:",
      "universal": "https://aw.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "awallet:",
      "universal": "https://aw.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/alpha_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Pillar",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "pillarwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "pillarwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/pillar.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "D'CENT Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "dcent:",
      "universal": "https://link.dcentwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "dcent:",
      "universal": "https://link.dcentwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/dcent.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ZelCore",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "zel:",
      "universal": "https://link.zel.network",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "zel:",
      "universal": "https://link.zel.network",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/zel_core.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Nash",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "nash:",
      "universal": "https://nash.io/walletconnect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "nash:",
      "universal": "https://nash.io/walletconnect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/nash.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Coinomi",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://coinomi.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://coinomi.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/coinomi.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "CYBAVO Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "cybavowallet:",
      "universal": "https://cdn.cybavo.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "cybavowallet:",
      "universal": "https://cdn.cybavo.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/cybavo.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Tokenary",
  "desktop": {
    "native": "tokenary:",
    "universal": "https://tokenary.io",
    "connect": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/tokenary.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Torus",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/torus.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "SafePal",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "safepalwallet",
      "universal": "https://link.safepal.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "safepalwallet",
      "universal": "https://link.safepal.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/safepal.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Infinity Wallet",
  "desktop": {
    "native": "infinity:",
    "universal": "https://infinitywallet.io/",
    "connect": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/infinity_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bridge Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bridgewallet:",
      "universal": "https://bridge.mtpelerin.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bridgewallet:",
      "universal": "https://bridge.mtpelerin.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/mtperlin.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "SparkPoint",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "sparkpoint:",
      "universal": "https://sparkpoint.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "sparkpoint:",
      "universal": "https://sparkpoint.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/sparkpoint.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "PEAKDEFI Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "peakdefiwallet:",
      "universal": "https://peakdefi.com/download",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "peakdefiwallet:",
      "universal": "https://peakdefi.com/download",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/peakdefi.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "AT.Wallet",
  "desktop": {
    "native": "atwallet:",
    "qr": "WalletConnectV2",
    "connect": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "atwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "atwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/atwallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Ellipal",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ellipal:",
      "universal": "https://www.ellipal.com/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ellipal:",
      "universal": "https://www.ellipal.com/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/ellipal.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Aktionariat",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "aktionariat:",
      "universal": "https://app.aktionariat.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "aktionariat:",
      "universal": "https://app.aktionariat.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/aktionariat.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Talken Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "talken-wallet:",
      "universal": "https://talken.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "talken-wallet:",
      "universal": "https://talken.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/talken.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "KyberSwap",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "kyberswap:",
      "universal": "https://kyberswapnew.app.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "kyberswap:",
      "universal": "https://kyberswapnew.app.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/kyberswap.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Tongue Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "tongue:",
      "universal": "https://www.tongue.fi",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "tongue:",
      "universal": "https://www.tongue.fi",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/tongue.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "RWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "rwallet:",
      "universal": "https://www.rwallet.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "rwallet:",
      "universal": "https://www.rwallet.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/rwallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "O3Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "o3wallet:",
      "universal": "https://o3.network",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "o3wallet:",
      "universal": "https://o3.network",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/o3wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "HashKey Me",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "hashme:",
      "universal": "https://me.hashkey.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "hashme:",
      "universal": "https://me.hashkey.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/hashkeyme.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Guarda Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/guarda.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Defiant",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "defiantapp:",
      "universal": "https://defiantapp.tech",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "defiantapp:",
      "universal": "https://defiantapp.tech",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/defiant.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Valora",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "celo://wallet",
      "universal": "https://valoraapp.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "celo://wallet",
      "universal": "https://valoraapp.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/valora.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Celo Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "celowallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "celowallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/celo.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Elastos Essentials",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "essentials:",
      "universal": "https://essentials.elastos.net",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "essentials:",
      "universal": "https://essentials.elastos.net",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/elastos_essentials.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Stasis",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "stasis:",
      "universal": "https://app.stasis.net",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "stasis:",
      "universal": "https://app.stasis.net",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/stasis.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "JulWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "julwallet:",
      "universal": "https://justliquidity.org",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "julwallet:",
      "universal": "https://justliquidity.org",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/julwallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bitpie",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bitpie:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bitpie:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bitpie.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Minerva Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "minerva:",
      "universal": "https://minerva.digital",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "minerva:",
      "universal": "https://minerva.digital",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/minerva.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Tangem",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "tangem:",
      "universal": "https://app.tangem.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "tangem:",
      "universal": "https://app.tangem.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/tangem.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ioPay",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "iopay:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "iopay:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/io_pay.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Coinhub",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/coinhub.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Go Pocket",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/gopocket.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Wallet 3",
  "desktop": {
    "native": "wallet3:",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "wallet3:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "wallet3:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/wallet3.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "yiToken",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "yitoken:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "yitoken:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/yitoken.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "DID Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "abt:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "abt:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/didwallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Shinobi Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "shinobi-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "shinobi-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/shinobi_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "AirGap Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "airgap-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "airgap-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/air_gap_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "SecuX",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "secux://",
      "universal": "https://wsweb.secuxtech.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "secux://",
      "universal": "https://wsweb.secuxtech.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/secux.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Orange",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "orangewallet:",
      "universal": "https://link.orangewallet.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "orangewallet:",
      "universal": "https://link.orangewallet.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/orange.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Krystal",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "krystalWallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "krystalWallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/krystal.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Kriptomat",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "kriptomatapp://wallet-connect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "kriptomatapp://wallet-connect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/kriptomat.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Ambire Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ambire:",
      "universal": "https://mobile.ambire.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ambire:",
      "universal": "https://mobile.ambire.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/ambire_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "PayBolt",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "paybolt://Wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "paybolt://Wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/pay_bolt.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "OKX",
  "extensions": ["OKXEVM", "OKXSVM"],
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "okex://main",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2",
      "open": function open() {
        return "okx://wallet/dapp/url?dappUrl=".concat(encodeURIComponent(window.location.toString()));
      }
    },
    "android": {
      "native": "okex://main",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2",
      "open": function open() {
        return "okx://wallet/dapp/url?dappUrl=".concat(encodeURIComponent(window.location.toString()));
      }
    }
  },
  "logo": (_wallets$OKXEVM = wallets.OKXEVM) === null || _wallets$OKXEVM === void 0 ? void 0 : (_wallets$OKXEVM$info = _wallets$OKXEVM.info) === null || _wallets$OKXEVM$info === void 0 ? void 0 : _wallets$OKXEVM$info.logo,
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Mask Network",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/mask_network.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Uniblow",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/uniblow.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Autonomy: Digital Art Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "autonomy-wc",
      "universal": "https://autonomy.io/apps/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "autonomy-wc",
      "universal": "https://autonomy.io/apps/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/autonomy.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Lilico",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "lilico://",
      "universal": "https://link.lilico.app/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "lilico://",
      "universal": "https://link.lilico.app/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/lilico.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Fireblocks",
  "desktop": {
    "universal": "https://console.fireblocks.io/v2",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "fireblocks-wc://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "fireblocks-wc://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/fireblocks.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "WATT ME",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "wattwallet://wallet-connect/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "wattwallet://wallet-connect/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/wattme.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Coingrig",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "coingrig://",
      "universal": "https://link.coingrig.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "coingrig://",
      "universal": "https://link.coingrig.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/coingrig.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Cryptnox Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/cryptnox_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "bobablocks",
  "desktop": {
    "native": "bobablocks://",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bobablocks://",
      "universal": "https://app.bobablocks.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bobablocks://",
      "universal": "https://app.bobablocks.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bobablocks.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Plasma Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "plasmawallet:",
      "universal": "https://plasma-wallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "plasmawallet:",
      "universal": "https://plasma-wallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/plasma_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "HUMBL WALLET",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "humblwallet:",
      "universal": "https://wallet.search3.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "humblwallet:",
      "universal": "https://wallet.search3.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/humbl_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Zelus",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "zeluswallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "zeluswallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/zelus.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Earth Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "earthwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "earthwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/earth_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Boba Multisig",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/boba_multisig.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "EASY",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "co.theeasy.app://",
      "universal": "https://link.easy.me",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "co.theeasy.app://",
      "universal": "https://link.easy.me",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/easy.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ISLAMIwallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "islamiwallet://islami.com/path/",
      "universal": "https://islamiwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "islamiwallet://islami.com/path/",
      "universal": "https://islamiwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/islam_iwallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Card Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "cardwallet://",
      "universal": "https://wallet.cardstack.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "cardwallet://",
      "universal": "https://wallet.cardstack.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/card_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "GameStop Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/game_stop_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "RealT Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/real_t_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "PLTwallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "pltwallet:",
      "universal": "https://pltwallet.io/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "pltwallet:",
      "universal": "https://pltwallet.io/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/pl_twallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Avacus",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "avacus://",
      "universal": "https://avacus.app.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "avacus://",
      "universal": "https://avacus.app.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/avacus.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "StrikeX Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "strikex://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "strikex://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/strike_x_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "BCERTin wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/bcer_tin_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Edge Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "edge://",
      "universal": "https://deep.edge.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "edge://",
      "universal": "https://deep.edge.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/edge_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Freedom Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "freedom-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "freedom-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/freedom_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Assure",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "assure://",
      "universal": "https://www.assure.pro/Official",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "assure://",
      "universal": "https://www.assure.pro/Official",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/assure.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Cosmostation",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "cosmostation://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "cosmostation://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/cosmostation.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "THORWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "thorwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "thorwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/thor_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Gryfyn",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/gryfyn.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "CoinStats",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "coinstats:",
      "universal": "https://coinstats.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "coinstats:",
      "universal": "https://coinstats.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/coin_stats.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Abra Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "abra:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "abra:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/abra_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Opera Crypto Browser",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "cryptobrowser://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "cryptobrowser://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/opera_crypto_browser.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Keywallet Touch",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "keywalletTouch://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "keywalletTouch://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/keywallet_touch.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Enno Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ennowallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ennowallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/enno_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "A4 Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/a4_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bitcoin.com Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bitcoincom://",
      "universal": "https://wallet.bitcoin.com/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bitcoincom://",
      "universal": "https://wallet.bitcoin.com/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bitcoincom.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Defiant",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "defiantapp://",
      "universal": "https://defiantapp.tech/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "defiantapp://",
      "universal": "https://defiantapp.tech/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/defiant.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Chain",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/chain.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Verso",
  "desktop": {
    "native": "verso",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "verso",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "verso",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/verso.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "LOBSTR Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "lobstr://",
      "universal": "https://lobstr.co/uni/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "lobstr://",
      "universal": "https://lobstr.co/uni/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/lobstr_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bifrost Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bifrostwallet:",
      "universal": "https://app.bifrostwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bifrostwallet:",
      "universal": "https://app.bifrostwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bifrost_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Okse Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "oksewallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "oksewallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/okse_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "BRISE Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/brise_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "HyperPay",
  "extension": "HyperPay",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": (_wallets$HyperPay = wallets.HyperPay) === null || _wallets$HyperPay === void 0 ? void 0 : (_wallets$HyperPay$inf = _wallets$HyperPay.info) === null || _wallets$HyperPay$inf === void 0 ? void 0 : _wallets$HyperPay$inf.logo,
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ATON",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/aton.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Frontier",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "frontier://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "frontier://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/frontier.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "MDAO Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ttmwalletapp://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ttmwalletapp://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/mdao_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "TTM Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ttmwalletapp:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ttmwalletapp:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/ttm_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Opto Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "opto://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "opto://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/opto_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "XFUN Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "xfunwallet://",
      "universal": "https://xfun.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "xfunwallet://",
      "universal": "https://xfun.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/xfun_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Exodus",
  "extensions": ["ExodusEVM", "ExodusSVM"],
  "desktop": {
    "native": "exodus://",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "exodus://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "exodus://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/exodus.jpg",
  "blockchains": _toConsumableArray(supported)
}, {
  "name": "Uvtoken",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "UvToken://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "UvToken://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/uv_token.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "PREMA Wallet",
  "desktop": {
    "native": "premawallet:",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "premawallet:",
      "universal": "https://premanft.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "premawallet:",
      "universal": "https://premanft.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/prema_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Shinobi-Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "shinobi-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "shinobi-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/shinobi.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ByteBank",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "hideoutWallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "hideoutWallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/byte_bank.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Ancrypto Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ancrypto://app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ancrypto://app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/ancrypto_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bee Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "beewallet.app://",
      "universal": "https://beewallet.app/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "beewallet.app://",
      "universal": "https://beewallet.app/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bee_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "LATOKEN Multichain DeFi Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "dfwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "dfwallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/latoken_multichain_de_fi_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "TK Finance",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "tk://",
      "universal": "https://trustkeys.network",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "tk://",
      "universal": "https://trustkeys.network",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/tk_finance.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Oxalus Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "oxalus://",
      "universal": "https://deeplink.oxalus.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "oxalus://",
      "universal": "https://deeplink.oxalus.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/oxalus_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "3S Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bhcwallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bhcwallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/3_s_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Klever Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "kleverwallet:",
      "universal": "https://klever.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "kleverwallet:",
      "universal": "https://klever.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/klever_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "OneKey",
  "desktop": {
    "native": "onekey-wallet://",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "onekey-wallet://",
      "universal": "https://app.onekey.so/wc/connect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "onekey-wallet://",
      "universal": "https://app.onekey.so/wc/connect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/one_key.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "helix id",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "helix-id://helix-id.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "helix-id://helix-id.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/helix_id.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ABC Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "abc-wallet://abcwc",
      "universal": "https://abcwalletconnect.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "abc-wallet://abcwc",
      "universal": "https://abcwalletconnect.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/abcwallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "HaHa",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "haha://",
      "universal": "https://haha.me",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "haha://",
      "universal": "https://haha.me",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/haha.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Volt: DeFi",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "volt:",
      "universal": "https://get.voltage.finance",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "volt:",
      "universal": "https://get.voltage.finance",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/volt.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Robinhood Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "robinhood-wallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "robinhood-wallet:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/robinhood_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "RiceWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "ricewallet",
      "universal": "https://ricewallet.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "ricewallet",
      "universal": "https://ricewallet.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/rice_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "SafeMoon",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "safemoon:",
      "universal": "https://safemoon.net/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "safemoon:",
      "universal": "https://safemoon.net/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/safemoon.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "SimpleHold",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "simplehold://",
      "universal": "https://simplehold.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "simplehold://",
      "universal": "https://simplehold.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/simple_hold.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "GoldBit",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "goldbit://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "goldbit://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/gold_bit.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ioPay",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "iopay:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "iopay:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/iopay.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bitizen",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bitizen://wallet",
      "universal": "https://bitizen.org/wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bitizen://wallet",
      "universal": "https://bitizen.org/wallet",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bitizen.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Slavi Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "slaviwallet:",
      "universal": "https://www.slaviwallet.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "slaviwallet:",
      "universal": "https://www.slaviwallet.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/slavi_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Nufinetes",
  "desktop": {
    "native": "vimwallet:/",
    "connect": "WalletConnectV2",
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "vimwallet:/",
      "universal": "https://apple.vimworld.org",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "vimwallet:/",
      "universal": "https://apple.vimworld.org",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/nufinetes.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Arianee Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "com.arianee.wallet",
      "universal": "https://arianee.net",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "com.arianee.wallet",
      "universal": "https://arianee.net",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/arianee_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "NOW Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "walletnow://",
      "universal": "https://walletnow.app.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "walletnow://",
      "universal": "https://walletnow.app.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/now_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Arculus Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "arculuswc:",
      "universal": "https://gw.arculus.co/app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "arculuswc:",
      "universal": "https://gw.arculus.co/app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/arculus_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Linen",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "linen:",
      "universal": "https://linen.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "linen:",
      "universal": "https://linen.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/linen.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Nitrogen Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://nitrogen.org/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://nitrogen.org/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/nitrogen_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ApolloX",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://app.apollox.finance",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://app.apollox.finance",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/apollo_x.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ID Pocket",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/id_pocket.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "CoinCircle",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://coincircle.com/app/walletconnect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://coincircle.com/app/walletconnect",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/coin_circle.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "SahalWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/sahal_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "UPBOND Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/upbond_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Sequence Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://sequence.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://sequence.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/sequence_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "LocalTrade Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://ws.lab.localtrade.cc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://ws.lab.localtrade.cc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/local_trade_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Loopring Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/loopring_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Vision: Crypto Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://app.vision-crypto.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://app.vision-crypto.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/vision.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Ballet Crypto",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/ballet_crypto.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Pitaka",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "pitaka://",
      "universal": "https://app.pitaka.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "pitaka://",
      "universal": "https://app.pitaka.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/pitaka.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "AbsoluteWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/absolute_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "The Parallel",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/the_parallel.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "CypherD Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/cypher_d_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Keplr",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/keplr.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "MyWalliD",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/my_walli_d.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Status",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/status.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Monarch Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://monarchwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://monarchwallet.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/monarch_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Marble",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://app.marblewallet.com/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://app.marblewallet.com/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/marble.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Flooz",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://wallet.flooz.trade/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://wallet.flooz.trade/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/flooz.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Blockchain.com",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "blockchain-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "blockchain-wallet://",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/blockchaincom.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Dohrnii Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/dohrnii_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "UniPass",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://wallet.unipass.id",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://wallet.unipass.id",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/uni_pass.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ZenGo",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "zengo://get.zengo.com/",
      "universal": "https://get.zengo.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "zengo://get.zengo.com/",
      "universal": "https://get.zengo.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/zengo2.png",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Locker Token",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/locker_token.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Keeper",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://link.keeper-wallet.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://link.keeper-wallet.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/keeper.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "XDEFI Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/xdefi_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Numio",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/numio.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Neon Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/neon_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Nabox",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://nabox.io/app/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://nabox.io/app/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/nabox.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Snowball",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://app.snowball.exchange/app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://app.snowball.exchange/app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/snowball.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "KryptoGO Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://kryptogo.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://kryptogo.page.link",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/krypto_go_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Payperless",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/payperless.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Brave Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/brave_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Crossmint",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/crossmint.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Safematrix",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://safematrix.io/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://safematrix.io/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/safematrix.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "pier",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://pierwallet.com/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://pierwallet.com/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/pier.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "FILWallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://h5.filwallet.co",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://h5.filwallet.co",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/fil_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "ParaSwap Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://wallet.paraswap.io/#/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://wallet.paraswap.io/#/",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/para_swap_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Bitski",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "bitski:",
      "universal": "https://wallet.bitski.com/walletconnect/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "bitski:",
      "universal": "https://wallet.bitski.com/walletconnect/wc",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/bitski.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Hippo Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "hippowallet://",
      "universal": "https://hippowallet.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "hippowallet://",
      "universal": "https://hippowallet.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/hippo_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Core",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://core.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://core.app",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/core.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Xcapit",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://app.xcapit.com/links",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://app.xcapit.com/links",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/xcapit.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Paper",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "universal": "https://withpaper.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "universal": "https://withpaper.com",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/paper_wallet.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "MetaOne",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "metaone:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "metaone:",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/metaone.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Enjin Wallet",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "mobile": {
    "ios": {
      "native": "enjinwallet:",
      "universal": "https://deeplink.wallet.enjin.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    },
    "android": {
      "native": "enjinwallet:",
      "universal": "https://deeplink.wallet.enjin.io",
      "connect": "WalletConnectV2",
      "qr": "WalletConnectV2"
    }
  },
  "logo": "https://img1.depay.com/wallets/enjin.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "BC Vault",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "https://img1.depay.com/wallets/bc_vault.jpg",
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Ethereum Wallet",
  "extension": "WindowEthereum",
  "logo": (_wallets$WindowEthere = wallets.WindowEthereum) === null || _wallets$WindowEthere === void 0 ? void 0 : (_wallets$WindowEthere2 = _wallets$WindowEthere.info) === null || _wallets$WindowEthere2 === void 0 ? void 0 : _wallets$WindowEthere2.logo,
  "blockchains": _toConsumableArray(supported.evm)
}, {
  "name": "Solana Pay",
  "desktop": {
    "solanaPay": true
  },
  "mobile": {
    "ios": {
      "solanaPay": true
    },
    "android": {
      "solanaPay": true
    }
  },
  "logo": (_Blockchains$solana = Blockchains.solana) === null || _Blockchains$solana === void 0 ? void 0 : _Blockchains$solana.logo,
  "blockchains": _toConsumableArray(supported.svm)
}, {
  "name": "Solana Wallet",
  "extension": "WindowSolana",
  "desktop": {
    "solanaPay": true
  },
  "mobile": {
    "ios": {
      "solanaPay": true
    },
    "android": {
      "solanaPay": true
    }
  },
  "logo": (_wallets$WindowSolana = wallets.WindowSolana) === null || _wallets$WindowSolana === void 0 ? void 0 : (_wallets$WindowSolana2 = _wallets$WindowSolana.info) === null || _wallets$WindowSolana2 === void 0 ? void 0 : _wallets$WindowSolana2.logo,
  "blockchains": _toConsumableArray(supported.svm)
}, {
  "name": "WalletConnect",
  "desktop": {
    "qr": "WalletConnectV2"
  },
  "logo": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0nMS4wJyBlbmNvZGluZz0ndXRmLTgnPz48IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjUuNC4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAtLT48c3ZnIHZlcnNpb249JzEuMScgaWQ9J0xheWVyXzEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB2aWV3Qm94PScwIDAgNTAwIDUwMCcgc3R5bGU9J2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTAwIDUwMDsnIHhtbDpzcGFjZT0ncHJlc2VydmUnPjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+IC5zdDB7ZmlsbDojNTk5MUNEO30KPC9zdHlsZT48ZyBpZD0nUGFnZS0xJz48ZyBpZD0nd2FsbGV0Y29ubmVjdC1sb2dvLWFsdCc+PHBhdGggaWQ9J1dhbGxldENvbm5lY3QnIGNsYXNzPSdzdDAnIGQ9J00xMDIuNywxNjJjODEuNS03OS44LDIxMy42LTc5LjgsMjk1LjEsMGw5LjgsOS42YzQuMSw0LDQuMSwxMC41LDAsMTQuNEwzNzQsMjE4LjkgYy0yLDItNS4zLDItNy40LDBsLTEzLjUtMTMuMmMtNTYuOC01NS43LTE0OS01NS43LTIwNS44LDBsLTE0LjUsMTQuMWMtMiwyLTUuMywyLTcuNCwwTDkxLjksMTg3Yy00LjEtNC00LjEtMTAuNSwwLTE0LjQgTDEwMi43LDE2MnogTTQ2Ny4xLDIyOS45bDI5LjksMjkuMmM0LjEsNCw0LjEsMTAuNSwwLDE0LjRMMzYyLjMsNDA1LjRjLTQuMSw0LTEwLjcsNC0xNC44LDBjMCwwLDAsMCwwLDBMMjUyLDMxMS45IGMtMS0xLTIuNy0xLTMuNywwaDBsLTk1LjUsOTMuNWMtNC4xLDQtMTAuNyw0LTE0LjgsMGMwLDAsMCwwLDAsMEwzLjQsMjczLjZjLTQuMS00LTQuMS0xMC41LDAtMTQuNGwyOS45LTI5LjIgYzQuMS00LDEwLjctNCwxNC44LDBsOTUuNSw5My41YzEsMSwyLjcsMSwzLjcsMGMwLDAsMCwwLDAsMGw5NS41LTkzLjVjNC4xLTQsMTAuNy00LDE0LjgsMGMwLDAsMCwwLDAsMGw5NS41LDkzLjUgYzEsMSwyLjcsMSwzLjcsMGw5NS41LTkzLjVDNDU2LjQsMjI1LjksNDYzLDIyNS45LDQ2Ny4xLDIyOS45eicvPjwvZz48L2c+PC9zdmc+Cg==",
  "blockchains": _toConsumableArray(supported.evm)
}].filter(function (wallet) {
  return wallet.blockchains.filter(Boolean).length > 0;
});

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime_1 = createCommonjsModule(function (module) {
var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

var regenerator = runtime_1;

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

var ClosableContext = /*#__PURE__*/React.createContext();

var UpdatableContext = /*#__PURE__*/React.createContext();

function useEvent(fn) {
  var ref = useRef(fn);
  useEffect(function () {
    ref.current = fn;
  }, [fn]);
  return useCallback(function () {
    return ref.current.apply(ref, arguments);
  }, []);
}

var ClosableProvider = (function (props) {
  var _useState = useState(props.closable || true),
      _useState2 = _slicedToArray(_useState, 2),
      closable = _useState2[0],
      setClosable = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      open = _useState4[0],
      setOpen = _useState4[1];

  var _useContext = useContext(UpdatableContext),
      setUpdatable = _useContext.setUpdatable;

  var close = useEvent(function () {
    if (props.closable === false) {
      return;
    }

    if (!closable) {
      return;
    }

    var close = true;

    if (typeof closable === 'string') {
      close = confirm(closable);
    }

    if (close) {
      setUpdatable(false);
      setOpen(false);
      setTimeout(props.unmount, 300);
    }
  });
  useEffect(function () {
    var preventReload = function preventReload(event) {
      if (!closable || props.closable === false) {
        var msg = 'Payment is still pending. Please wait!';
        event.preventDefault();
        event.returnValue = msg;
        return msg;
      } else if (typeof closable === 'string') {
        var _msg = closable;
        event.preventDefault();
        event.returnValue = _msg;
        return _msg;
      }
    };

    window.addEventListener('beforeunload', preventReload);
    return function () {
      window.removeEventListener('beforeunload', preventReload);
    };
  }, [closable, props.closable]);
  return /*#__PURE__*/React.createElement(ClosableContext.Provider, {
    value: {
      closable: closable,
      setClosable: setClosable,
      close: close,
      open: open,
      setOpen: setOpen
    }
  }, props.children);
});

var ConfigurationContext = /*#__PURE__*/React.createContext({
  accept: []
});

var debounce = (function (fn, wait) {
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var timerId;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = this;

    var later = function later() {
      timerId = null;

      if (!immediate) {
        fn.apply(context, args);
      }
    };

    var callNow = immediate && !timerId;
    clearTimeout(timerId);
    timerId = setTimeout(later, wait);

    if (callNow) {
      fn.apply(context, args);
    }
  };
});

var ChevronLeftIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: ["ChevronLeft", "Icon", props.className].filter(Boolean).join(' '),
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("path", {
    strokeWidth: "1",
    fillRule: "evenodd",
    d: "M10.4,1.6c0.2,0.2,0.2,0.5,0,0.7L4.7,8l5.6,5.6c0.2,0.2,0.2,0.5,0,0.7s-0.5,0.2-0.7,0l-6-6l0,0,c-0.2-0.2-0.2-0.5,0-0.7l6-6l0,0C9.8,1.5,10.2,1.5,10.4,1.6L10.4,1.6z"
  }));
});

var CloseIcon = (function () {
  return /*#__PURE__*/React.createElement("svg", {
    className: "CloseIcon Icon",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
});

var Dialog$1 = (function (props) {
  var _useContext = useContext(NavigateStackContext),
      navigate = _useContext.navigate;

  var _useContext2 = useContext(ClosableContext),
      close = _useContext2.close,
      closable = _useContext2.closable;

  return /*#__PURE__*/React.createElement("div", {
    className: ["Dialog", props.className].join(' ')
  }, /*#__PURE__*/React.createElement("div", {
    className: ["DialogHeader", props.stacked ? 'TextCenter' : ''].join(' ')
  }, props.stacked && /*#__PURE__*/React.createElement("div", {
    className: "DialogHeaderActionLeft PaddingTopS PaddingLeftS PaddingRightS"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return navigate('back');
    },
    className: "ButtonCircular",
    title: "Go back"
  }, /*#__PURE__*/React.createElement(ChevronLeftIcon, null))), closable && props.closable !== false && /*#__PURE__*/React.createElement("div", {
    className: "DialogHeaderActionRight PaddingTopS PaddingLeftS PaddingRightS"
  }, props.alternativeHeaderAction, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: close,
    className: "ButtonCircular",
    title: "Close dialog"
  }, /*#__PURE__*/React.createElement(CloseIcon, null))), props.header), /*#__PURE__*/React.createElement("div", {
    ref: props.bodyRef,
    className: ["DialogBody", props.bodyClassName].join(' ')
  }, props.body), props.footer !== false && /*#__PURE__*/React.createElement("div", {
    className: "DialogFooter"
  }, props.footer));
});

var ExtensionIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "ExtensionIcon Icon",
    xmlns: "http://www.w3.org/2000/svg",
    width: props.width,
    height: props.width,
    viewBox: "0 0 280 250"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M172.8,68.3c-4.9-2.2-7.4-8.4-4.5-13.6c5.3-9.4,10-18.6,4.3-29.1c-7-12.7-24.1-17.4-36.6-10c-15.4,9.1-13.4,25.6-5.1,38.9,c3.3,5.2,0.9,11.6-4.2,13.9l-61.2,0.1l0,0.8l0.1,21.8l0.1,37.9c-1.9,5.5-8.7,8.4-14.1,5c-13.4-8.3-29.8-10.1-38.9,5.3,c-7.3,12.5-2.5,29.7,10.2,36.5c10.5,5.7,19.7,1,29.1-4.4c5.4-3.1,11.9-0.3,13.8,5l0.1,59.8l57.2-0.1c0.1,0,0.2,0,0.3,0l3.6,0,c5-2.3,7.4-8.7,4.2-13.9c-8.3-13.3-10.3-29.8,5.1-38.9c12.5-7.4,29.6-2.7,36.6,10c5.7,10.5,1.1,19.7-4.3,29.1,c-2.9,5.2-0.5,11.4,4.5,13.6l3.6,0c0.1,0,0.2,0,0.3,0l56.5-0.1l-0.1-58.8c-1.4-6.6-7.8-9.2-14.1-5.8c-9.5,5.2-17.9,9.8-28.4,4.1,c-12.8-6.9-18.2-23.7-10.9-36.3c9-15.4,25.5-13.6,38.9-5.3c5.7,3.5,12.9,0.2,14.4-5.9l-0.1-35.4L233.3,69l0-0.8L172.8,68.3z"
  }));
});

var initMobileAppDebug = function initMobileAppDebug() {
  if (typeof window.eruda === 'undefined') {
    // Create a script element
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';

    script.onload = function () {
      // Initialize Eruda once the script is loaded
      window.eruda.init();
      console.log('Eruda has been initialized.');
    };

    document.body.appendChild(script);
  } else {
    console.log('Eruda is already loaded.');
  }
};

var isDarkMode = function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

var isMobile = function isMobile() {
  if (typeof window !== 'undefined') {
    return Boolean(window.matchMedia('(pointer:coarse)').matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/.test(navigator.userAgent));
  }

  return false;
};

var LinkIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "LinkIcon Icon",
    xmlns: "http://www.w3.org/2000/svg",
    width: props.width,
    height: props.width,
    viewBox: "0 0 512 512"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M459.654,233.373l-90.531,90.5c-49.969,50-131.031,50-181,0c-7.875-7.844-14.031-16.688-19.438-25.813,l42.063-42.063c2-2.016,4.469-3.172,6.828-4.531c2.906,9.938,7.984,19.344,15.797,27.156c24.953,24.969,65.563,24.938,90.5,0,l90.5-90.5c24.969-24.969,24.969-65.563,0-90.516c-24.938-24.953-65.531-24.953-90.5,0l-32.188,32.219,c-26.109-10.172-54.25-12.906-81.641-8.891l68.578-68.578c50-49.984,131.031-49.984,181.031,0,C509.623,102.342,509.623,183.389,459.654,233.373z M220.326,382.186l-32.203,32.219c-24.953,24.938-65.563,24.938-90.516,0,c-24.953-24.969-24.953-65.563,0-90.531l90.516-90.5c24.969-24.969,65.547-24.969,90.5,0c7.797,7.797,12.875,17.203,15.813,27.125,c2.375-1.375,4.813-2.5,6.813-4.5l42.063-42.047c-5.375-9.156-11.563-17.969-19.438-25.828c-49.969-49.984-131.031-49.984-181.016,0,l-90.5,90.5c-49.984,50-49.984,131.031,0,181.031c49.984,49.969,131.031,49.969,181.016,0l68.594-68.594,C274.561,395.092,246.42,392.342,220.326,382.186z"
  }));
});

var QRCodeIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "QRCodeIcon Icon",
    xmlns: "http://www.w3.org/2000/svg",
    width: props.width,
    height: props.height,
    viewBox: "0 0 1000 1000",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("g", {
    transform: "translate(0 511) scale(.1 -.1)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m100 2797.1v-2212.9h4425.8v4425.8h-4425.8v-2212.9zm3477.4 0v-1264.5h-2529v2529h2529v-1264.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m1680.6 2797.1v-632.3h1264.6v1264.6h-1264.6v-632.3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m5474.2 2797.1v-2212.9h4425.8v4425.8h-4425.8v-2212.9zm3477.4 0v-1264.5h-2529v2529h2529v-1264.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m7054.8 2797.1v-632.3h1264.6v1264.6h-1264.6v-632.3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m100-2577.1v-2212.9h4425.8v4425.8h-4425.8v-2212.9zm3477.4 0v-1264.5h-2529v2529h2529v-1264.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m1680.6-2577.1v-632.3h1264.6v1264.6h-1264.6v-632.3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m5474.2-917.4v-553.2h1106.4v-1106.4h-1106.4v-1106.4h1106.4v-1106.6h1106.4v1106.4h1106.4v-1106.4h1106.6v1106.4h-1106.4v1106.4h1106.4v1106.4h-1106.4v1106.4h-1106.4v-1106.4h-1106.4v1106.4h-1106.4v-553zm3319.3-1106.5v-553.2h-1106.4v-1106.4h-1106.4v1106.4h1106.4v1106.4h1106.4v-553.2z"
  })));
});

var KEY = '_DePayConnectDialogPreviouslyConnectedWallet';

var set = function set(value) {
  localStorage[KEY] = value;
};

var get = function get() {
  return localStorage[KEY];
};

var ConnectWalletDialog = (function (props) {
  var _props$wallet, _props$platform14;

  var QRCodeElement = React.useRef();

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      extensionIsAvailable = _useState2[0],
      setExtensionIsAvailable = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      connectAppIsAvailable = _useState4[0],
      setConnectAppIsAvailable = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      openInAppIsAvailable = _useState6[0],
      setOpenInAppIsAvailable = _useState6[1];

  var _useState7 = useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      copyLinkIsAvailable = _useState8[0],
      setCopyLinkIsAvailable = _useState8[1];

  var _useState9 = useState(),
      _useState10 = _slicedToArray(_useState9, 2),
      scanQrAvailable = _useState10[0],
      setScanQrAvailable = _useState10[1];

  var _useState11 = useState(),
      _useState12 = _slicedToArray(_useState11, 2),
      appIsConnected = _useState12[0],
      setAppIsConnected = _useState12[1];

  var _useState13 = useState(),
      _useState14 = _slicedToArray(_useState13, 2);
      _useState14[0];
      _useState14[1];

  var _useState15 = useState(),
      _useState16 = _slicedToArray(_useState15, 2),
      connectionError = _useState16[0],
      setConnectionError = _useState16[1];

  var _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      showQRCode = _useState18[0],
      setShowQRCode = _useState18[1];

  var _useState19 = useState(false),
      _useState20 = _slicedToArray(_useState19, 2),
      showLinkCopied = _useState20[0],
      setShowLinkCopied = _useState20[1];

  var _useState21 = useState(),
      _useState22 = _slicedToArray(_useState21, 2),
      QRCode = _useState22[0],
      setQRCode = _useState22[1];

  var _useContext = useContext(NavigateStackContext);
      _useContext.navigate;

  var _useContext2 = useContext(ConfigurationContext),
      accept = _useContext2.accept;

  var header = /*#__PURE__*/React.createElement("div", {
    className: "PaddingTopS PaddingLeftM PaddingRightM"
  }, ((_props$wallet = props.wallet) === null || _props$wallet === void 0 ? void 0 : _props$wallet.logo) && /*#__PURE__*/React.createElement("div", {
    className: "PaddingTopXS"
  }, /*#__PURE__*/React.createElement("div", {
    className: "LineHeightL FontSizeL PaddingTopS"
  }, /*#__PURE__*/React.createElement("span", {
    className: "CardImage rounded large"
  }, /*#__PURE__*/React.createElement("img", {
    onClick: initMobileAppDebug,
    className: "transparent",
    src: props.wallet.logo
  })))));

  var handleConnectionError = function handleConnectionError(error) {
    if (typeof error == 'string') {
      setConnectionError(error);
    } else {
      setConnectionError();
    }
  };

  var connectViaCopyLink = function connectViaCopyLink() {
    var wallet = new wallets[props.platform.copyLink]();
    setConnectionError();
    wallet.connect({
      name: props.wallet.name,
      logo: props.wallet.logo,
      reconnect: true,
      connect: function connect(_ref) {
        var uri = _ref.uri;
        copy(uri);
        setShowLinkCopied(true);
        setTimeout(function () {
          return setShowLinkCopied(false);
        }, 3000);
      }
    }).then(function (account) {
      setConnectionError();
      props.resolve(account, wallet);
    })["catch"](handleConnectionError);
  };

  var getNewQRCode = function getNewQRCode() {
    return new QRCodeStyling({
      width: 340,
      height: 340,
      type: "svg",
      dotsOptions: {
        color: isDarkMode() ? "#FFFFFF" : "#000000",
        type: "extra-rounded"
      },
      cornersSquareOptions: {
        type: 'rounded'
      },
      backgroundOptions: {
        color: "transparent"
      }
    });
  };

  var connectViaQRCode = useCallback(debounce(function () {
    var _props$platform4, _props$platform5;

    if ((_props$platform4 = props.platform) !== null && _props$platform4 !== void 0 && _props$platform4.solanaPay && accept && accept.every(function (accept) {
      return accept.amount;
    })) {
      props.setSolanaPayWallet(props.wallet);
      return;
    }

    if (typeof props.platform.qr === 'function') {
      var newQRCode = getNewQRCode();
      newQRCode.update({
        data: props.platform.qr()
      });
      setQRCode(newQRCode);
      return;
    }

    switch ((_props$platform5 = props.platform) === null || _props$platform5 === void 0 ? void 0 : _props$platform5.qr) {
      case 'WalletConnectV1':
      case 'WalletConnectV2':
        if (QRCode == undefined) {
          localStorage[atob('ZGVwYXk6d2FsbGV0czp3YzI6cHJvamVjdElk')] = atob('YjFmYzJmMDZlYTIxMDdmY2Q5OWM2OGY0MTI3MTQxYWI=');

          var _wallet = new wallets[props.platform.qr]();

          setConnectionError();

          _wallet.connect({
            name: props.wallet.name,
            logo: props.wallet.logo,
            reconnect: true,
            connect: function connect(_ref2) {
              var uri = _ref2.uri;
              var newQRCode = getNewQRCode();
              newQRCode.update({
                data: uri
              });
              setQRCode(newQRCode);
            }
          }).then(function (account) {
            setConnectionError();
            props.resolve(account, _wallet);
          })["catch"](handleConnectionError);
        }

        break;

      case 'WalletLink':
        var wallet = new wallets[props.platform.qr]();
        setConnectionError();
        wallet.connect({
          connect: function connect(_ref3) {
            var uri = _ref3.uri;
            var newQRCode = getNewQRCode();
            newQRCode.update({
              data: uri
            });
            setQRCode(newQRCode);
          }
        }).then(function (account) {
          setConnectionError();
          props.resolve(account, wallet);
        })["catch"](handleConnectionError);
        break;
    }
  }, 100), []);
  useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
      var _props$wallet2, _props$wallet3, _props$platform6, _props$platform7, _props$platform8, _props$platform9;

      var extensionIsAvailable, appIsConnected, connectAppIsAvailable, copyLinkIsAvailable, openInAppIsAvailable, scanQrAvailable;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              extensionIsAvailable = false;

              if (!((_props$wallet2 = props.wallet) !== null && _props$wallet2 !== void 0 && _props$wallet2.extension)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 4;
              return wallets[props.wallet.extension].isAvailable();

            case 4:
              extensionIsAvailable = _context2.sent;
              _context2.next = 12;
              break;

            case 7:
              if (!((_props$wallet3 = props.wallet) !== null && _props$wallet3 !== void 0 && _props$wallet3.extensions)) {
                _context2.next = 12;
                break;
              }

              _context2.next = 10;
              return Promise.all(props.wallet.extensions.map( /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(extension) {
                  return regenerator.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return wallets[extension].isAvailable();

                        case 2:
                          return _context.abrupt("return", _context.sent);

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x) {
                  return _ref5.apply(this, arguments);
                };
              }()));

            case 10:
              _context2.t0 = _context2.sent.filter(Boolean).length;
              extensionIsAvailable = _context2.t0 > 0;

            case 12:
              setExtensionIsAvailable(extensionIsAvailable);

              if (!((_props$platform6 = props.platform) !== null && _props$platform6 !== void 0 && _props$platform6.connect)) {
                _context2.next = 22;
                break;
              }

              _context2.next = 16;
              return wallets[props.platform.connect].isAvailable();

            case 16:
              _context2.t2 = _context2.sent;

              if (_context2.t2) {
                _context2.next = 19;
                break;
              }

              _context2.t2 = false;

            case 19:
              _context2.t1 = _context2.t2;
              _context2.next = 23;
              break;

            case 22:
              _context2.t1 = false;

            case 23:
              appIsConnected = _context2.t1;
              setAppIsConnected(appIsConnected);
              connectAppIsAvailable = !!props.platform && props.platform.connect && !extensionIsAvailable;
              setConnectAppIsAvailable(connectAppIsAvailable);
              copyLinkIsAvailable = !!((_props$platform7 = props.platform) !== null && _props$platform7 !== void 0 && _props$platform7.copyLink);
              setCopyLinkIsAvailable(copyLinkIsAvailable);
              openInAppIsAvailable = !!props.platform && props.platform.open && !extensionIsAvailable;
              setOpenInAppIsAvailable(openInAppIsAvailable);
              scanQrAvailable = ((_props$platform8 = props.platform) === null || _props$platform8 === void 0 ? void 0 : _props$platform8.solanaPay) && accept && accept.every(function (accept) {
                return accept.amount;
              }) || ((_props$platform9 = props.platform) === null || _props$platform9 === void 0 ? void 0 : _props$platform9.qr) && (!showQRCode || props.platform.qr === 'WalletLink');
              setScanQrAvailable(scanQrAvailable);

              if (extensionIsAvailable && !connectAppIsAvailable && !copyLinkIsAvailable && !openInAppIsAvailable && !scanQrAvailable) {
                props.connectExtension(props.wallet);
              }

            case 34:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, []);
  useEffect(function () {
    if (appIsConnected !== undefined) {
      var _props$wallet4, _props$wallet4$deskto, _props$platform10, _props$platform11;

      setShowQRCode(!extensionIsAvailable && !isMobile() && !((_props$wallet4 = props.wallet) !== null && _props$wallet4 !== void 0 && (_props$wallet4$deskto = _props$wallet4.desktop) !== null && _props$wallet4$deskto !== void 0 && _props$wallet4$deskto["native"]) && (((_props$platform10 = props.platform) === null || _props$platform10 === void 0 ? void 0 : _props$platform10.qr) || ((_props$platform11 = props.platform) === null || _props$platform11 === void 0 ? void 0 : _props$platform11.solanaPay)));
    }
  }, [extensionIsAvailable, appIsConnected]);
  useEffect(function () {
    var _props$platform12, _props$platform13;

    if (showQRCode && ((_props$platform12 = props.platform) !== null && _props$platform12 !== void 0 && _props$platform12.qr || (_props$platform13 = props.platform) !== null && _props$platform13 !== void 0 && _props$platform13.solanaPay)) {
      connectViaQRCode();
    }
  }, [showQRCode]);
  useEffect(function () {
    if (showQRCode && QRCode && QRCodeElement && QRCodeElement.current) {
      QRCodeElement.current.innerHTML = "";
      QRCode.append(QRCodeElement.current);
    }
  }, [QRCode]);

  if (showQRCode && (_props$platform14 = props.platform) !== null && _props$platform14 !== void 0 && _props$platform14.solanaPay && accept && accept.every(function (accept) {
    return accept.amount;
  })) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: header,
    footer: false,
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter PaddingBottomS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftL PaddingRightL"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL FontWeightBold"
    }, "Connect ", props.wallet.name)), !extensionIsAvailable && !connectAppIsAvailable && !openInAppIsAvailable && !copyLinkIsAvailable && !scanQrAvailable && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftL PaddingRightL"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Alert FontSizeS"
    }, /*#__PURE__*/React.createElement("strong", null, "Unable to connect to this wallet!"))), (props.connectionError || connectionError) && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftL PaddingRightL"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Alert FontSizeS"
    }, /*#__PURE__*/React.createElement("strong", null, props.connectionError || connectionError))), showQRCode && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightXS PaddingBottomXS PaddingLeftXS"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      ref: QRCodeElement,
      className: "QRCode"
    }, showQRCode && QRCode === undefined && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton",
      style: {
        borderRadius: "18px",
        width: "305px",
        height: "305px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })))), showQRCode && QRCode === undefined && /*#__PURE__*/React.createElement("div", {
      className: "Opacity05 PaddingBottomXS PaddingTopS"
    }, /*#__PURE__*/React.createElement("small", null, "Generating QR code...")), showQRCode && QRCode !== undefined && /*#__PURE__*/React.createElement("div", {
      className: "Opacity05 PaddingBottomXS PaddingTopXS"
    }, /*#__PURE__*/React.createElement("small", null, "Scan QR code with your wallet")), (extensionIsAvailable || connectAppIsAvailable || openInAppIsAvailable || copyLinkIsAvailable) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS PaddingTopS Opacity03",
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderBottom: "1px solid black",
        flex: "0.4",
        position: "relative",
        top: '-9px'
      },
      className: "Opacity05"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "0.2"
      },
      className: "PaddingLeftXS PaddingRightXS"
    }, /*#__PURE__*/React.createElement("small", null, "or")), /*#__PURE__*/React.createElement("div", {
      style: {
        borderBottom: "1px solid black",
        flex: "0.4",
        position: "relative",
        top: '-9px'
      },
      className: "Opacity05"
    }))))), (extensionIsAvailable || connectAppIsAvailable || openInAppIsAvailable || scanQrAvailable && !showQRCode || copyLinkIsAvailable) && /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftL PaddingRightL PaddingTopS PaddingBottomS"
    }, extensionIsAvailable && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, props.showConnectExtensionWarning && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Alert"
    }, /*#__PURE__*/React.createElement("span", {
      className: "FontWeightBold PaddingBottomXS"
    }, "Your wallet extension is already open and asking to connect. It might be hidden."))), props.connectingExtension && /*#__PURE__*/React.createElement("div", {
      className: "Card disabled small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Loading Icon medium",
      style: {
        position: 'relative'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Connecting ", isMobile() ? 'app' : 'extension'))), !props.connectingExtension && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return props.connectExtension(props.wallet);
      },
      className: "Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, isMobile() && /*#__PURE__*/React.createElement("img", {
      className: "transparent ",
      title: "Click to connect app",
      style: {
        height: '28px',
        width: '28px',
        borderRadius: '8px'
      },
      src: props.wallet.logo
    }), !isMobile() && /*#__PURE__*/React.createElement(ExtensionIcon, {
      width: "26px",
      height: "26px"
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Connect ", isMobile() ? 'app' : 'extension')))), connectAppIsAvailable && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, props.connectingApp && /*#__PURE__*/React.createElement("div", {
      className: "Card disabled small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Loading Icon medium",
      style: {
        position: 'relative'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Connecting app"))), !props.connectingApp && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return props.connectViaRedirect(props.wallet);
      },
      className: "Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "transparent ",
      title: "Click to connect app",
      style: {
        height: '28px',
        width: '28px',
        borderRadius: '8px'
      },
      src: props.wallet.logo
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Connect app")))), openInAppIsAvailable && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return props.openInApp(props.wallet);
      },
      className: "Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      className: "transparent ",
      title: "Click to open in app",
      style: {
        height: '24px',
        width: '24px',
        borderRadius: '4px'
      },
      src: props.wallet.logo
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Open in app")))), scanQrAvailable && !showQRCode && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setShowQRCode(true);
        connectViaQRCode();
      },
      className: "Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, /*#__PURE__*/React.createElement(QRCodeIcon, {
      width: "20px",
      height: "20px"
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Scan QR code")))), copyLinkIsAvailable && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS TooltipWrapper"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: connectViaCopyLink,
      className: "Card small PaddingTopS PaddingRightXS PaddingBottomS PaddingLeftXS",
      style: {
        height: '50px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftS TextCenter",
      style: {
        width: "50px"
      }
    }, /*#__PURE__*/React.createElement(LinkIcon, {
      width: "18px",
      height: "18px"
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, "Copy connection link"))), showLinkCopied && /*#__PURE__*/React.createElement("div", {
      className: "Tooltip absolute top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TooltipArrowDown"
    }), "Connection link copied"))))
  });
});

var isAndroid = function isAndroid() {
  return navigator.userAgent.toLowerCase().includes('android');
};

var isWebView = function isWebView() {
  var userAgentToLower = navigator.userAgent.toLowerCase();
  return userAgentToLower.includes('webview') || userAgentToLower.includes('wv') || navigator.userAgent.toLowerCase().match(/\) mobile\//) && !userAgentToLower.includes('safari');
};

var isIOS = function isIOS() {
  return Boolean(/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

var platformForWallet = (function (walletMetaData) {
  var platform;

  if (isMobile()) {
    if (isAndroid()) {
      var _walletMetaData$mobil;

      platform = (_walletMetaData$mobil = walletMetaData.mobile) === null || _walletMetaData$mobil === void 0 ? void 0 : _walletMetaData$mobil.android;
    } else if (isIOS()) {
      var _walletMetaData$mobil2;

      platform = (_walletMetaData$mobil2 = walletMetaData.mobile) === null || _walletMetaData$mobil2 === void 0 ? void 0 : _walletMetaData$mobil2.ios;
    }
  } else {
    platform = walletMetaData.desktop;
  }

  return platform;
});

var link = function link(_ref) {
  var url = _ref.url,
      target = _ref.target,
      wallet = _ref.wallet;

  if (url && url.length && target == '_blank' && (wallet === null || wallet === void 0 ? void 0 : wallet.name) === 'World App' && url.match('depay.com')) {
    return "https://integrate.depay.fi/redirect?to=".concat(encodeURIComponent(url));
  }

  return url;
};

var WalletContext = /*#__PURE__*/React.createContext();

var PoweredBy = (function () {
  var walletContext = useContext(WalletContext);
  var wallet = walletContext ? walletContext.wallet : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: "PoweredByWrapper"
  }, /*#__PURE__*/React.createElement("a", {
    href: link({
      url: 'https://depay.com',
      target: '_blank',
      wallet: wallet
    }),
    rel: "noopener noreferrer",
    target: "_blank",
    className: "PoweredByLink",
    title: "powered by DePay"
  }, "DePay"));
});

var safeAppUrl = (function (href) {
  if (!href.includes('://')) {
    href = href.replaceAll('/', '').replaceAll(':', '');
    href = "".concat(href, "://");
  }

  return href;
});

var safeUniversalUrl = (function (href) {
  if (href.endsWith('/')) {
    href = href.slice(0, -1);
  }

  return href;
});

var SelectPlatformDialog = (function (props) {
  var _props$wallet;

  var blockchains = props.wallet.extensions.map(function (extension) {
    return wallets[extension].info.blockchains;
  }).flat();

  if (props.accept) {
    blockchains = blockchains.filter(function (blockchain) {
      return props.accept.some(function (configuration) {
        return configuration.blockchain === blockchain;
      });
    });
  }

  var selectBlockchain = function selectBlockchain(blockchain) {
    props.onSelect(props.wallet.extensions.find(function (extension) {
      return wallets[extension].info.blockchains.includes(blockchain);
    }));
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM"
    }, ((_props$wallet = props.wallet) === null || _props$wallet === void 0 ? void 0 : _props$wallet.logo) && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "LineHeightL FontSizeL PaddingTopS"
    }, /*#__PURE__*/React.createElement("span", {
      className: "CardImage rounded large"
    }, /*#__PURE__*/React.createElement("img", {
      className: "transparent",
      src: props.wallet.logo
    })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL FontWeightBold"
    }, "Select Blockchain"))),
    stacked: true,
    bodyClassName: "ScrollHeight",
    body: /*#__PURE__*/React.createElement("div", null, blockchains.map(function (blockchain) {
      return /*#__PURE__*/React.createElement("div", {
        key: blockchain,
        className: "Card Row TextLeft",
        onClick: function onClick() {
          return selectBlockchain(blockchain);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardImage"
      }, /*#__PURE__*/React.createElement("img", {
        className: "transparent BlockchainLogo",
        src: Blockchains[blockchain].logo,
        style: {
          backgroundColor: Blockchains[blockchain].logoBackgroundColor
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React.createElement("span", {
        className: "CardText"
      }, Blockchains[blockchain].label)));
    })),
    footer: null
  });
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var DropDown = (function (props) {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      clickCount = _useState2[0],
      setClickCount = _useState2[1];

  useEffect(function () {
    var handleClick = function handleClick() {
      setClickCount(clickCount + 1);

      if (clickCount == 0) {
        return;
      }

      props.hide();
    };

    window.addEventListener('click', handleClick);
    return function () {
      window.removeEventListener('click', handleClick);
    };
  }, [props.open, clickCount]);
  return /*#__PURE__*/React.createElement("div", {
    className: "DropDown ".concat(props.open ? 'open' : '')
  }, /*#__PURE__*/React.createElement("ul", null, props.items.map(function (item, index) {
    return /*#__PURE__*/React.createElement("li", {
      key: index
    }, /*#__PURE__*/React.createElement("button", {
      className: "DropDownItem",
      onClick: function onClick() {
        return item.action();
      }
    }, item.label));
  })));
});

var MenuIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "MenuIcon Icon",
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "11.6",
    y1: "17.6",
    x2: "11.6",
    y2: "17.6"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "11.6",
    y1: "11.8",
    x2: "11.6",
    y2: "11.8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "11.6",
    y1: "6.2",
    x2: "11.6",
    y2: "6.2"
  }));
});

var throttle = (function (fn, wait) {
  var lastTime = 0;
  return function () {
    var now = Date.now();
    var remaining = wait - (now - lastTime);
    var context = this;

    if (remaining <= 0) {
      lastTime = now;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      fn.apply(context, args);
    } // else: ignore call

  };
});

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var SelectWalletList = (function (props) {
  var _useContext = useContext(ConfigurationContext),
      walletsConfiguration = _useContext.wallets;

  var allowList = (walletsConfiguration === null || walletsConfiguration === void 0 ? void 0 : walletsConfiguration.allow) || (walletsConfiguration === null || walletsConfiguration === void 0 ? void 0 : walletsConfiguration.whitelist);
  var allWallets$1;

  if (walletsConfiguration !== null && walletsConfiguration !== void 0 && walletsConfiguration.sort || allowList) {
    allWallets$1 = useMemo(function () {
      var adjustedWallets = _toConsumableArray(allWallets);

      if (walletsConfiguration !== null && walletsConfiguration !== void 0 && walletsConfiguration.sort) {
        walletsConfiguration.sort.forEach(function (sortedWallet, newIndex) {
          var currentListIndex = adjustedWallets.findIndex(function (unsortedWallet) {
            return unsortedWallet.name === sortedWallet;
          });

          if (currentListIndex > -1) {
            adjustedWallets.splice(newIndex, 0, adjustedWallets.splice(currentListIndex, 1)[0]);
          }
        });
      }

      if (allowList) {
        adjustedWallets = adjustedWallets.filter(function (wallet) {
          return allowList.indexOf(wallet.name) > -1;
        });
      }

      return adjustedWallets;
    }, [walletsConfiguration]);
  } else {
    allWallets$1 = allWallets;
  }

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      listScrolled = _useState2[0],
      setListScrolled = _useState2[1];

  var throttledSetListScrolled = useCallback(throttle(function (value) {
    return setListScrolled(value);
  }, 1000), []);

  var handleOnScroll = function handleOnScroll(event) {
    if (!listScrolled) {
      throttledSetListScrolled(true);
    }

    if (event.target.scrollTop <= 0 && allWallets$1.length > 9) {
      throttledSetListScrolled(false);
    }
  };

  var parentElement = React.useRef();
  var fuse = new Fuse(allWallets$1, {
    keys: ['name'],
    threshold: 0.3,
    ignoreFieldNorm: true
  });

  var _useState3 = useState(allWallets$1),
      _useState4 = _slicedToArray(_useState3, 2),
      resultList = _useState4[0],
      setResultList = _useState4[1];

  var rowVirtualizer = useVirtualizer({
    count: resultList.length,
    getScrollElement: function getScrollElement() {
      return parentElement.current;
    },
    estimateSize: function estimateSize() {
      return 61;
    }
  });
  useEffect(function () {
    var results = fuse.search(props.searchTerm).map(function (result) {
      return result.item;
    });

    if (parentElement.current) {
      parentElement.current.scrollTo(0, 0);
    }

    if (props.searchTerm.length) {
      setResultList(results);
    } else {
      setResultList(allWallets$1);
    }
  }, [props.searchTerm]);
  useEffect(function () {
    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'Enter' && resultList.length == 1) {
        props.onClickWallet(resultList[0]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resultList]);
  return /*#__PURE__*/React.createElement("div", {
    ref: parentElement,
    onScroll: handleOnScroll,
    className: "DialogBody ScrollHeightAnimation ".concat(listScrolled ? 'ScrollHeightMax' : 'ScrollHeightM', " PaddingBottomS PaddingLeftS PaddingRightS")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "".concat(rowVirtualizer.getTotalSize(), "px"),
      width: '100%',
      position: 'relative'
    }
  }, rowVirtualizer.getVirtualItems().map(function (virtualItem) {
    return /*#__PURE__*/React.createElement("div", {
      key: virtualItem.key,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: "".concat(virtualItem.size, "px"),
        transform: "translateY(".concat(virtualItem.start, "px)")
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Card small",
      title: "Connect ".concat(resultList[virtualItem.key].name),
      onClick: function onClick() {
        props.onClickWallet(_objectSpread$7({}, resultList[virtualItem.key]));
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage"
    }, /*#__PURE__*/React.createElement("img", _defineProperty({
      className: "transparent",
      src: resultList[virtualItem.key].logo
    }, "className", "WalletLogoS"))), /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper PaddingLeftXS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText"
    }, resultList[virtualItem.key].name))))));
  })));
});

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var SelectWalletDialog = (function (props) {
  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      searchTerm = _useState2[0],
      setSearchTerm = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      detectedWallets = _useState4[0],
      setDetectedWallets = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      previouslyConnectedWallet = _useState6[0],
      setPreviouslyConnectedWallet = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      showDropDown = _useState8[0],
      setShowDropDown = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      dialogAnimationFinished = _useState10[0],
      setDialogAnimationFinished = _useState10[1];

  var _useContext = useContext(ConfigurationContext),
      walletsConfiguration = _useContext.wallets;

  var searchElement = useRef();
  var listElement = useRef();

  var _useContext2 = useContext(NavigateStackContext),
      navigate = _useContext2.navigate;

  var allowList = (walletsConfiguration === null || walletsConfiguration === void 0 ? void 0 : walletsConfiguration.allow) || (walletsConfiguration === null || walletsConfiguration === void 0 ? void 0 : walletsConfiguration.whitelist);
  var allWallets$1;

  if (walletsConfiguration !== null && walletsConfiguration !== void 0 && walletsConfiguration.sort || allowList) {
    allWallets$1 = useMemo(function () {
      var adjustedWallets = _toConsumableArray(allWallets);

      if (walletsConfiguration !== null && walletsConfiguration !== void 0 && walletsConfiguration.sort) {
        walletsConfiguration.sort.forEach(function (sortedWallet, newIndex) {
          var currentListIndex = adjustedWallets.findIndex(function (unsortedWallet) {
            return unsortedWallet.name === sortedWallet;
          });

          if (currentListIndex > -1) {
            adjustedWallets.splice(newIndex, 0, adjustedWallets.splice(currentListIndex, 1)[0]);
          }
        });
      }

      if (allowList) {
        adjustedWallets = adjustedWallets.filter(function (wallet) {
          return allowList.indexOf(wallet.name) > -1;
        });
      }

      return adjustedWallets;
    }, [walletsConfiguration]);
  } else {
    allWallets$1 = allWallets;
  }

  var onClickWallet = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(walletMetaData, wallet) {
      var platform, extensionIsAvailable;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(walletMetaData.via == 'detected')) {
                _context.next = 4;
                break;
              }

              if (walletMetaData.connectionType == 'app') {
                wallet.account().then(function (account) {
                  if (account) {
                    props.resolve(account, wallet);
                  }
                });
                props.setWallet(walletMetaData);
                navigate('ConnectWallet');
              } else if (walletMetaData.connectionType == 'extension') {
                props.setWallet(walletMetaData);
                props.connectExtension(walletMetaData);
                navigate('ConnectWallet');
              }

              _context.next = 22;
              break;

            case 4:
              if (!isMobile()) {
                _context.next = 20;
                break;
              }

              platform = platformForWallet(walletMetaData);

              if (!walletMetaData.extension) {
                _context.next = 12;
                break;
              }

              _context.next = 9;
              return wallets[walletMetaData.extension].isAvailable();

            case 9:
              extensionIsAvailable = _context.sent;
              _context.next = 17;
              break;

            case 12:
              if (!walletMetaData.extensions) {
                _context.next = 17;
                break;
              }

              _context.next = 15;
              return Promise.all(walletMetaData.extensions.map(function (extension) {
                return wallets[extension].isAvailable();
              }));

            case 15:
              _context.t0 = _context.sent.filter(Boolean).length;
              extensionIsAvailable = _context.t0 > 0;

            case 17:
              if (platform && platform.open) {
                if (!extensionIsAvailable) {
                  props.openInApp(walletMetaData);
                }

                props.setWallet(walletMetaData);
                navigate('ConnectWallet');
              } else {
                if (!extensionIsAvailable) {
                  props.connectViaRedirect(walletMetaData);
                }

                props.setWallet(walletMetaData);
                navigate('ConnectWallet');
              }

              _context.next = 22;
              break;

            case 20:
              props.setWallet(walletMetaData);
              navigate('ConnectWallet');

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function onClickWallet(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  useEffect(function () {
    var focusNextElement = function focusNextElement(event) {
      var focusable = Array.from(listElement.current.querySelectorAll('button.Card'));
      var index = focusable.indexOf(listElement.current.querySelector(':focus'));

      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else if (index < focusable.length - 1) {
        focusable[0].focus();
        event.preventDefault();
        return false;
      }
    };

    var focusPrevElement = function focusPrevElement(event) {
      var focusable = Array.from(listElement.current.querySelectorAll('button.Card'));
      var index = focusable.indexOf(listElement.current.querySelector(':focus'));

      if (index == 0) {
        searchElement.current.focus();
      } else if (index > 0 && index <= focusable.length - 1) {
        focusable[index - 1].focus();
      }
    };

    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'ArrowUp') {
        focusPrevElement();
      } else if (event.key === 'ArrowDown') {
        focusNextElement(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(function () {
    if (allWallets$1.length === 1) {
      onClickWallet(allWallets$1[0]);
    }
  }, [allWallets$1]);
  useEffect(function () {
    if (detectedWallets.length == 1) {
      var wallet = allWallets$1.find(function (wallet) {
        return wallet.name === detectedWallets[0].info.name;
      });

      if (wallet.autoSelect) {
        onClickWallet(wallet);
      }
    }
  }, [detectedWallets]);
  useEffect(function () {
    var wallets = [];
    getWallets({
      drip: function drip(wallet) {
        wallets = wallets.concat(wallet);

        if (walletsConfiguration !== null && walletsConfiguration !== void 0 && walletsConfiguration.sort || allowList) {
          var adjustedWallets = _toConsumableArray(wallets);

          if (walletsConfiguration !== null && walletsConfiguration !== void 0 && walletsConfiguration.sort) {
            walletsConfiguration.sort.forEach(function (sortedWallet, newIndex) {
              var currentListIndex = adjustedWallets.findIndex(function (unsortedWallet) {
                var _unsortedWallet$info;

                return (unsortedWallet === null || unsortedWallet === void 0 ? void 0 : (_unsortedWallet$info = unsortedWallet.info) === null || _unsortedWallet$info === void 0 ? void 0 : _unsortedWallet$info.name) === sortedWallet;
              });

              if (currentListIndex > -1) {
                adjustedWallets.splice(newIndex, 0, adjustedWallets.splice(currentListIndex, 1)[0]);
              }
            });
          }

          if (allowList) {
            adjustedWallets = adjustedWallets.filter(function (wallet) {
              var _wallet$info;

              return allowList.indexOf(wallet === null || wallet === void 0 ? void 0 : (_wallet$info = wallet.info) === null || _wallet$info === void 0 ? void 0 : _wallet$info.name) > -1;
            });
          }

          setDetectedWallets(adjustedWallets);
        } else {
          setDetectedWallets(wallets);
        }
      }
    });
    var previouslyConnectedWalletName = get();
    var previouslyConnectedWallet = allWallets$1.find(function (wallet) {
      return wallet.name == previouslyConnectedWalletName;
    }) || allWallets$1.find(function (wallet) {
      return wallet.name == previouslyConnectedWalletName;
    });

    if (previouslyConnectedWallet) {
      setPreviouslyConnectedWallet(previouslyConnectedWallet);
    }
  }, []);
  useEffect(function () {
    setTimeout(function () {
      setDialogAnimationFinished(true);

      if (!isMobile()) {
        if (searchElement.current) {
          searchElement.current.click();
          searchElement.current.focus();
        }
      }
    }, 200);
  }, []);
  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft PaddingBottomS"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Select a wallet")), (detectedWallets && detectedWallets.length > 0 || previouslyConnectedWallet) && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS PaddingLeftS PaddingRightS"
    }, detectedWallets.filter(function (wallet, index, array) {
      return array.findIndex(function (target) {
        var _target$info, _wallet$info2;

        return (target === null || target === void 0 ? void 0 : (_target$info = target.info) === null || _target$info === void 0 ? void 0 : _target$info.name) === (wallet === null || wallet === void 0 ? void 0 : (_wallet$info2 = wallet.info) === null || _wallet$info2 === void 0 ? void 0 : _wallet$info2.name);
      }) === index;
    }).map(function (wallet, index) {
      var walletMetaData = allWallets$1.find(function (walletFromList) {
        return walletFromList.name === (wallet.info ? wallet.info.name : wallet.name);
      });

      if (!walletMetaData) {
        return null;
      }

      var connectionType = 'app';

      if (wallet && wallet.constructor && ![wallets.WalletConnectV1, wallets.WalletConnectV2, wallets.WalletLink].includes(wallet.constructor)) {
        connectionType = 'extension';
      }

      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "PaddingBottomXS"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "Card small",
        title: "Connect ".concat(walletMetaData.name),
        onClick: function onClick() {
          onClickWallet(_objectSpread$6(_objectSpread$6({}, walletMetaData), {}, {
            via: 'detected',
            connectionType: connectionType
          }), wallet);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardImage"
      }, /*#__PURE__*/React.createElement("img", _defineProperty({
        className: "transparent",
        src: walletMetaData.logo
      }, "className", "WalletLogoS"))), /*#__PURE__*/React.createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardBodyWrapper PaddingLeftXS LineHeightXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardText FontWeightMedium"
      }, walletMetaData.name), /*#__PURE__*/React.createElement("div", {
        className: "TextColorSuccess"
      }, /*#__PURE__*/React.createElement("span", {
        className: "TextColorSuccess",
        style: {
          fontSize: '70%',
          top: '-1px',
          position: 'relative'
        }
      }, "\u25CF"), " Detected")))));
    }), previouslyConnectedWallet && !detectedWallets.find(function (wallet) {
      return previouslyConnectedWallet.name === (wallet.info ? wallet.info.name : wallet.name);
    }) && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Card small",
      title: "Connect ".concat(previouslyConnectedWallet.name),
      onClick: function onClick() {
        onClickWallet(_objectSpread$6(_objectSpread$6({}, previouslyConnectedWallet), {}, {
          via: 'previouslyConnected',
          connectionType: 'app'
        }));
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage"
    }, /*#__PURE__*/React.createElement("img", _defineProperty({
      className: "transparent",
      src: previouslyConnectedWallet.logo
    }, "className", "WalletLogoS"))), /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper PaddingLeftXS LineHeightXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText FontWeightMedium"
    }, previouslyConnectedWallet.name), /*#__PURE__*/React.createElement("div", {
      className: "Opacity05"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '70%',
        top: '-1px',
        position: 'relative'
      }
    }, "\u25CF"), " Used previously")))))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS PaddingLeftS PaddingRightS PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Row"
    }, allWallets$1.length > 4 && /*#__PURE__*/React.createElement("input", {
      className: "Search",
      value: searchTerm,
      onChange: function onChange(event) {
        setSearchTerm(event.target.value);
      },
      placeholder: "Search by name",
      ref: searchElement
    })))),
    alternativeHeaderAction: /*#__PURE__*/React.createElement("span", {
      className: "DropDownWrapper"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return setShowDropDown(!showDropDown);
      },
      className: "ButtonCircular",
      title: "More options"
    }, /*#__PURE__*/React.createElement(MenuIcon, null)), showDropDown && /*#__PURE__*/React.createElement(DropDown, {
      hide: function hide() {
        return setShowDropDown(false);
      },
      items: [{
        label: "What is a wallet?",
        action: function action() {
          navigate('WhatIsAWallet');
        }
      }, {
        label: "Wallet missing?",
        action: function action() {
          window.open("https://support.depay.com?query=".concat(encodeURIComponent("Can you add support for the following wallet")), '_blank');
        }
      }, {
        label: "Problems connecting?",
        action: function action() {
          window.open("https://support.depay.com?query=".concat(encodeURIComponent("I have problems connecting my wallet")), '_blank');
        }
      }]
    })),
    bodyClassName: "PaddingBottomXS",
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS",
      ref: listElement
    }, dialogAnimationFinished && /*#__PURE__*/React.createElement(SelectWalletList, {
      setWallet: props.setWallet,
      searchTerm: searchTerm,
      onClickWallet: onClickWallet
    }), !dialogAnimationFinished &&
    /*#__PURE__*/
    // placeholder
    React.createElement("div", {
      className: "ScrollHeightM DialogBody PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "60px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton Card small",
      style: {
        height: "57px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: "60px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton Card small",
      style: {
        height: "57px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: "60px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton Card small",
      style: {
        height: "57px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: "60px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton Card small",
      style: {
        height: "57px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))))),
    footer: false
  });
});

var QuestionsGraphic = (function (props) {
  var _walletMeta, _walletMeta2, _walletMeta2$colors, _walletMeta3, _walletMeta3$colors, _walletMeta4, _walletMeta4$colors, _walletMeta5, _walletMeta5$colors, _walletMeta6, _walletMeta6$colors, _walletMeta7, _walletMeta7$colors, _walletMeta8, _walletMeta8$colors, _walletMeta9, _walletMeta9$colors, _walletMeta10, _walletMeta10$colors, _walletMeta11, _walletMeta11$colors, _walletMeta12, _walletMeta12$colors, _walletMeta13, _walletMeta13$colors, _walletMeta14, _walletMeta14$colors, _walletMeta15, _walletMeta15$colors, _walletMeta16, _walletMeta16$colors, _walletMeta17, _walletMeta17$colors, _walletMeta18, _walletMeta18$colors, _walletMeta19, _walletMeta19$colors, _walletMeta20, _walletMeta20$colors, _walletMeta21, _walletMeta21$colors, _walletMeta22, _walletMeta22$colors, _walletMeta23, _walletMeta23$colors, _walletMeta24, _walletMeta24$colors, _walletMeta25, _walletMeta25$colors, _walletMeta26, _walletMeta26$colors, _walletMeta27, _walletMeta27$colors, _walletMeta28, _walletMeta28$colors, _walletMeta29, _walletMeta29$colors, _walletMeta30, _walletMeta30$colors, _walletMeta31, _walletMeta31$colors, _walletMeta32, _walletMeta32$colors, _walletMeta33, _walletMeta33$colors, _walletMeta34, _walletMeta34$colors, _walletMeta35, _walletMeta35$colors, _walletMeta36, _walletMeta36$colors, _walletMeta37, _walletMeta37$colors, _walletMeta38, _walletMeta38$colors, _walletMeta39, _walletMeta39$colors, _walletMeta40, _walletMeta40$colors, _walletMeta41, _walletMeta41$colors, _walletMeta42, _walletMeta42$colors, _walletMeta43, _walletMeta43$colors, _walletMeta44, _walletMeta44$colors, _walletMeta45, _walletMeta45$colors, _walletMeta46, _walletMeta46$colors, _walletMeta47, _walletMeta48, _walletMeta48$colors, _walletMeta49, _walletMeta49$colors, _walletMeta50, _walletMeta50$colors, _walletMeta51, _walletMeta52, _walletMeta52$colors, _walletMeta53, _walletMeta53$colors;

  var walletctx = useContext(WalletContext);
  var wallet = (walletctx === null || walletctx === void 0 ? void 0 : walletctx.wallet) || (walletctx === null || walletctx === void 0 ? void 0 : walletctx.solanaPayWallet);
  var walletMeta = wallet ? allWallets.find(function (walletMeta) {
    return walletMeta.name == wallet.name;
  }) : undefined;

  if (!((_walletMeta = walletMeta) !== null && _walletMeta !== void 0 && _walletMeta.colors)) {
    walletMeta = undefined;
  }

  return /*#__PURE__*/React.createElement("svg", {
    className: "Graphic " + props.className,
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    x: "0px",
    y: "0px",
    viewBox: "0 0 1128.7 1024"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    opacity: "0.5",
    className: "GraphicActiveColor",
    d: "M1013.1,314.2c.4,1.2,1,2.3,2,3.2.5.4,1,.8,1.6,1.1,1.1.6,2.3.9,3.6.8.4,0,.8,0,1.2,0,1,0,1.9-.2,2.7-.7.9-.3,1.7-.9,2.4-1.6.7-.7,1.2-1.5,1.5-2.5.4-.9.6-1.8.5-2.7,0-.6-.2-1.2-.3-1.8-.4-1.2-1-2.3-2-3.2-.5-.4-1.1-.8-1.6-1.1-1.1-.6-2.3-.9-3.6-.8-.4,0-.8,0-1.2,0-1,0-1.9.2-2.7.7-.9.3-1.7.9-2.4,1.6-.7.7-1.2,1.5-1.5,2.5-.4.9-.6,1.8-.5,2.7,0,.6.2,1.2.3,1.8Z"
  }), /*#__PURE__*/React.createElement("path", {
    opacity: "0.5",
    className: "GraphicActiveColor",
    d: "M1110.6,235.7c-2-10.1-8.1-15.5-16.1-21.3-1.1-.6-2.2-1.1-3.3-1.5-13.8-5.4-39.7.6-39.9,18.8,0,4.4,2.6,9,6.8,10.2,1.8.5,3.6.4,5.4,0,2.2-.6,4.2-1.7,5.9-3,7-5.7,18.1-8.4,23.6,1.1,4.9,9.3-6.1,15.9-13.7,19.2-1,.4-2,.8-3,1.2-7.1,2.7-14.5,4.6-21.4,7.8-11.2,5.2-20.8,13.8-25.5,25.4-1.1,3.8,1.9,4.8,4.9,5.1,2.3.2,4.8-1.9,6.5-3.3,7-8.6,16-14,25.8-16.6,13.6-3.6,29.1-7,38.3-18.6,5.4-6.8,7.2-15.9,5.5-24.4Z"
  })), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M612,971.9c-6.9-4.2-16-4.7-23.5-2-2.1.8-4.2,1.7-6.1,2.8,8-42.4,16.3-84.7,21.6-128,.9-7.1,1.7-14.2,2.4-21.4.7-7.2,1.3-14.4,1.8-21.6.3-4.6-3-9.1-6.1-8.9-3.6.2-5.7,3.8-6.1,8.8-.4,5.1-.7,10.2-1.3,15.3v-.3c0,.6,0,1.6-.1,2.4-.6,6-1.2,12-2,17.9-1.4,12.1-3.1,24.1-5,36.1-3.7,23.8-8,47.4-12.4,70.9-2.5,13.3-5.1,26.6-7.5,40-.4,2-.2,4.1.4,6,0,.6,0,1.2.3,1.8.3,1.1,1,2.2,2.2,2.8,3.8,2.2,8,4,12.3,4.9s8.7,1.7,13.1,2.2c4.6.4,9.2.2,13.7-.9,4.2-1.1,9.1-3,11.2-7,4.2-7.9-2.2-17.4-9-21.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M451.2,983.7c-2.5-13.3-5-26.6-7.5-40-4.4-23.5-8.8-47.1-12.4-70.9-1.8-12-3.5-24-5-36.1-.7-6-1.4-11.9-2-17.9,0-.3-.2-2.1-.2-2.2,0-.5,0-1.1-.1-1.6-.1-1.4-.3-2.8-.4-4.3-.3-3-.5-6-.7-9-.4-4.9-2.5-8.5-6.1-8.7-3-.2-6.4,4.2-6,8.7.5,7.2,1.1,14.4,1.8,21.5.7,7.2,1.5,14.3,2.4,21.4,5.3,43.3,13.6,85.6,21.6,128-1.9-1.1-3.9-2.1-6.1-2.8-7.6-2.7-16.6-2.2-23.5,2-6.7,4.1-13.2,13.6-9,21.5,2.1,4,7,6,11.2,7,4.5,1.1,9.1,1.4,13.7.9,4.4-.4,8.8-1.2,13.1-2.2,4.3-.9,8.5-2.7,12.3-4.9,1.2-.6,1.9-1.6,2.2-2.8.2-.6.3-1.2.3-1.8.6-1.9.8-4,.4-6Z"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M975.2,199.9c-.7.3-1.3.5-2,.8-1.6.6-2.9,1.5-3.9,2.7-1.3,1.1-2.3,2.4-2.9,4-.7,1.6-1,3.2-.9,4.9-.1,1.6.1,3.2.8,4.7.5.9,1.1,1.9,1.6,2.8,1.4,1.8,3.1,3.1,5.2,4,1.1.3,2.2.6,3.2.9,2.2.3,4.3,0,6.3-.8.7-.3,1.3-.5,2-.8,1.6-.6,2.9-1.5,3.9-2.7,1.3-1.1,2.3-2.4,2.9-4,.7-1.6,1-3.2.9-4.9.1-1.6-.1-3.2-.8-4.7-.5-.9-1.1-1.9-1.6-2.8-1.4-1.8-3.1-3.1-5.2-4-1.1-.3-2.2-.6-3.2-.9-2.2-.3-4.3,0-6.3.8h0Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M1005.9,71.6c3.2-2.2,5.8-5.3,7.7-8.5,7.9-13.5,24.3-24.7,39-12.6,13.6,12.1-.3,29.5-10.5,39.4-1.4,1.3-2.8,2.5-4.2,3.8-9.9,8.6-20.7,16.3-29.9,25.7-15,15.3-25.3,35.1-25.9,56.8.5,6.8,6,6.7,11.1,5.3,3.9-1,6.7-6,8.6-9.2,6.1-18.3,17.5-32.4,31.8-42.6,19.8-14.2,43-29.1,50.9-53.5,4.7-14.4,2-30.3-5.9-43-9.4-15.2-22.6-20.2-39-24.9-2.1-.3-4.2-.4-6.3-.5-25.8-.4-64,25.1-53.3,54.8,2.6,7.2,9.6,13.1,17.2,12.4,3.1-.3,6.1-1.5,8.7-3.4Z"
  })), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta2 = walletMeta) === null || _walletMeta2 === void 0 ? void 0 : (_walletMeta2$colors = _walletMeta2.colors) === null || _walletMeta2$colors === void 0 ? void 0 : _walletMeta2$colors.primary) || "#d88568",
    d: "M833.8,842.7c-164.2,44.7-346.5,56.9-518.8,56.4-9.6,0-19.1,0-28.6-.2-53.6-.5-111.7-6.9-153-44.3-5.5-5.1-10.6-10.8-15-16.9-3.9-5.4-7.4-11.2-10.7-17.4-3.3-6.2-6.2-12.9-8.8-20-4.4-11.7-7.9-23.7-10.7-35.6-28.9-149.8-44.7-303.7-31.2-455.8,3.1-14.3,8-28.1,15.5-40.8,7.5-12.7,17.5-24.3,30.8-34.2,32.8-24.2,72.3-25.7,109.7-33.9,13.1-2.2,26.3-4.2,39.4-6.1,117.1-17.1,234.8-29.6,352.9-37.8,83-5.7,175.1-27.1,254.1,7.8,84.3,37.2,103.6,125.2,115.4,206,11.3,77.7,17.2,156.2,17.3,234.7,0,63.8,0,130.9-48.6,180.5-27.7,28.3-66.7,46-109.7,57.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M810.7,838.9c-15.7,6.7-32,10.2-48.5,16.2-7.9,2.3-15.8,4.4-23.7,6.4-7.9,2-15.7,3.8-23.6,5.4-10.5,2.1-21,4-31.6,5.8-122.4,21.1-250.6,28.5-374.1,29.1-8.8,0-17.6,0-26.4,0-59.1-1.2-124.6-2.9-172.4-40.7-6.6-5.6-12.5-11.9-17.8-19.1-3.8-5.3-7.4-10.9-10.6-17s-6.2-12.6-8.8-19.6c-4.4-11.5-7.9-23.3-10.7-34.9-28.6-146.8-44.1-297.7-30.3-446.8,3.1-14.1,8.1-27.6,15.6-40,7.5-12.5,17.5-23.8,30.9-33.6,32.8-23.8,72.4-25.3,109.8-33.5,13.1-2.2,26.3-4.2,39.4-6.1,117.1-16.9,234.9-29.5,352.9-37.7,83-5.8,175.1-26.9,254,7.1,84.2,36.3,103.4,122.5,115,201.8,7,47.6,11.8,95.5,14.5,143.5.5,9.6,1,19.2,1.3,28.8,2.1,52.7,6.4,104.9-4.1,157.8-12.4,61.2-69.5,102.3-127.7,118.3-7.5,3-15.2,5.9-23.1,8.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta3 = walletMeta) === null || _walletMeta3 === void 0 ? void 0 : (_walletMeta3$colors = _walletMeta3.colors) === null || _walletMeta3$colors === void 0 ? void 0 : _walletMeta3$colors.primary) || "#d88568",
    d: "M789.4,864.5c-106.9,29.7-217.2,43.4-327.5,51.8-43.1,3.3-87.3,3.7-131,4.3-8.7.1-17.4.2-26.1.4-72-.5-152.3-.5-210.1-48.5-5.5-5.3-10.5-11.1-15-17.5-3.9-5.6-7.4-11.6-10.5-17.7-3.1-6.1-5.8-12.4-8.2-18.7-4.4-12-7.9-24.3-10.8-36.5C23.7,641.9,8.6,499.4,14.9,356.5c2-45.4,10.7-88.7,48.6-117.9,31.4-23.9,74-28.5,111.9-34.5,48-7.6,96.1-14.3,144.4-20.4,88.9-11.2,178.1-19.6,267.5-25.9,75.1-5.2,153.8-21.3,225.3,11.5,83.7,38.4,103.1,128.5,115,211.4,11.4,79.6,17.6,160,17.9,240.4.3,65.3.5,134.1-47.6,184.7-27.4,28.8-65.9,46.8-108.6,58.7Z"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.5"
  }, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta4 = walletMeta) === null || _walletMeta4 === void 0 ? void 0 : (_walletMeta4$colors = _walletMeta4.colors) === null || _walletMeta4$colors === void 0 ? void 0 : _walletMeta4$colors.secondary) || "#000000",
    d: "M123.9,271.4c3.9-.7,7.9-1.8,11.5-3.2,1.6-.6,3.5-1.4,5-2.5,1.5-1.1,2.9-2.4,3.4-4.3.8-3-.2-6.7-3.1-8.2-1.3-.7-2.9-.8-4.4-.5-1.7.2-3.4.6-5,1-2.9.6-5.7,1.5-8.5,2.5-2.4.9-4.9,1.7-6.6,3.6-2,2.2-1.8,5.4-.8,8,1.1,3,3.7,4.2,6.7,3.9.6,0,1.3-.1,1.9-.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta5 = walletMeta) === null || _walletMeta5 === void 0 ? void 0 : (_walletMeta5$colors = _walletMeta5.colors) === null || _walletMeta5$colors === void 0 ? void 0 : _walletMeta5$colors.secondary) || "#000000",
    d: "M169.8,257.8c4-.1,8.1-.9,11.9-2,3.4-1,7.7-2.3,9.1-6,1.1-2.9.4-6.7-2.4-8.4-1.3-.8-2.8-1-4.3-.9-1.7,0-3.4.2-5.1.5-2.9.4-5.8,1-8.7,1.7-2.5.6-5,1.1-7,2.8-2.2,2-2.4,5.2-1.7,7.9.8,3.1,3.2,4.6,6.2,4.6.6,0,1.3,0,1.9,0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta6 = walletMeta) === null || _walletMeta6 === void 0 ? void 0 : (_walletMeta6$colors = _walletMeta6.colors) === null || _walletMeta6$colors === void 0 ? void 0 : _walletMeta6$colors.secondary) || "#000000",
    d: "M217,248.3c4,.1,8.2-.5,12-1.3,3.5-.7,7.9-1.9,9.4-5.5,1.2-2.8.7-6.7-1.9-8.5-1.2-.8-2.7-1.1-4.2-1.2-1.7,0-3.4,0-5.1.2-2.9.2-5.8.6-8.7,1.1-2.5.4-5,.8-7.1,2.3-2.3,1.7-2.7,5-2.2,7.7.6,3.1,2.8,4.8,5.9,5,.6,0,1.3,0,1.9.1Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta7 = walletMeta) === null || _walletMeta7 === void 0 ? void 0 : (_walletMeta7$colors = _walletMeta7.colors) === null || _walletMeta7$colors === void 0 ? void 0 : _walletMeta7$colors.secondary) || "#000000",
    d: "M264.9,241c4,.2,8.2-.2,12.1-1,3.5-.7,7.9-1.8,9.5-5.4,1.2-2.8.8-6.7-1.8-8.6-1.2-.9-2.7-1.2-4.2-1.2-1.7,0-3.4,0-5.1.1-2.9.1-5.8.5-8.7.9-2.5.4-5,.6-7.1,2.1-2.4,1.7-2.9,4.9-2.5,7.6.5,3.1,2.7,4.9,5.8,5.2.6,0,1.3.1,1.9.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta8 = walletMeta) === null || _walletMeta8 === void 0 ? void 0 : (_walletMeta8$colors = _walletMeta8.colors) === null || _walletMeta8$colors === void 0 ? void 0 : _walletMeta8$colors.secondary) || "#000000",
    d: "M313.1,234.1c4,.2,8.2-.3,12.1-1.2,3.5-.8,7.9-1.7,9.5-5.3,1.2-2.8.8-6.6-1.8-8.6-1.2-.9-2.7-1.2-4.2-1.3-1.7-.1-3.4,0-5.1.1-2.9.2-5.8.6-8.7,1.1-2.5.4-5,.7-7.1,2.2-2.3,1.7-2.8,4.9-2.4,7.6.5,3.1,2.7,4.9,5.8,5.2.6,0,1.3.1,2,.1Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta9 = walletMeta) === null || _walletMeta9 === void 0 ? void 0 : (_walletMeta9$colors = _walletMeta9.colors) === null || _walletMeta9$colors === void 0 ? void 0 : _walletMeta9$colors.secondary) || "#000000",
    d: "M361.1,227.9c4,.3,8.2,0,12.1-.7,3.5-.6,7.9-1.6,9.7-5.2,1.3-2.8,1-6.7-1.6-8.6-1.2-.9-2.7-1.2-4.2-1.3-1.7-.1-3.4,0-5.1,0-2.9,0-5.8.4-8.8.7-2.5.3-5,.5-7.2,2-2.4,1.6-3,4.8-2.6,7.6.4,3.1,2.6,5,5.7,5.4.6,0,1.3.2,1.9.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta10 = walletMeta) === null || _walletMeta10 === void 0 ? void 0 : (_walletMeta10$colors = _walletMeta10.colors) === null || _walletMeta10$colors === void 0 ? void 0 : _walletMeta10$colors.secondary) || "#000000",
    d: "M409.3,222.6c4,.4,8.2.1,12.1-.5,3.5-.5,8-1.4,9.8-5,1.4-2.8,1.1-6.6-1.4-8.6-1.2-.9-2.7-1.3-4.1-1.4-1.7-.1-3.4-.1-5.1-.1-2.9,0-5.8.3-8.7.6-2.5.3-5,.4-7.2,1.8-2.4,1.6-3.1,4.8-2.8,7.5.3,3.2,2.5,5,5.5,5.5.6,0,1.3.2,1.9.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta11 = walletMeta) === null || _walletMeta11 === void 0 ? void 0 : (_walletMeta11$colors = _walletMeta11.colors) === null || _walletMeta11$colors === void 0 ? void 0 : _walletMeta11$colors.secondary) || "#000000",
    d: "M457.7,218c4,.4,8.2.2,12.1-.3,3.6-.5,8-1.3,9.8-4.9,1.4-2.7,1.2-6.6-1.4-8.7-1.2-.9-2.7-1.3-4.1-1.4-1.7-.2-3.4-.2-5.1-.2-2.9,0-5.8.2-8.7.5-2.5.2-5,.4-7.2,1.8-2.4,1.6-3.1,4.8-2.9,7.5.3,3.2,2.4,5,5.5,5.5.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta12 = walletMeta) === null || _walletMeta12 === void 0 ? void 0 : (_walletMeta12$colors = _walletMeta12.colors) === null || _walletMeta12$colors === void 0 ? void 0 : _walletMeta12$colors.secondary) || "#000000",
    d: "M506.1,214c4,.5,8.2.3,12.1-.2,3.6-.5,8-1.3,9.9-4.8,1.4-2.7,1.3-6.6-1.3-8.7-1.1-.9-2.6-1.3-4.1-1.5-1.7-.2-3.4-.2-5.1-.2-2.9,0-5.8.1-8.7.4-2.5.2-5,.3-7.2,1.7-2.5,1.5-3.2,4.7-3,7.5.3,3.2,2.4,5,5.4,5.6.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta13 = walletMeta) === null || _walletMeta13 === void 0 ? void 0 : (_walletMeta13$colors = _walletMeta13.colors) === null || _walletMeta13$colors === void 0 ? void 0 : _walletMeta13$colors.secondary) || "#000000",
    d: "M554.6,210.4c4,.4,8.3.2,12.2-.4,3.6-.5,8.1-1.5,9.8-5,1.3-2.8,1.1-6.7-1.5-8.6-1.2-.9-2.7-1.3-4.1-1.4-1.7-.1-3.4-.1-5-.1-2.9,0-5.8.2-8.7.5-2.5.3-5,.3-7.2,1.7-2.4,1.6-3.2,4.7-2.9,7.5.3,3.2,2.4,5.1,5.5,5.6.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta14 = walletMeta) === null || _walletMeta14 === void 0 ? void 0 : (_walletMeta14$colors = _walletMeta14.colors) === null || _walletMeta14$colors === void 0 ? void 0 : _walletMeta14$colors.secondary) || "#000000",
    d: "M603.1,205.5c4,.4,8.2,0,12.1-.5,3.5-.5,8-1.4,9.7-5,1.4-2.7,1.2-6.6-1.4-8.7-1.2-.9-2.7-1.3-4.1-1.4-1.7-.1-3.4-.1-5.1-.1-2.9,0-5.8.3-8.8.6-2.5.3-5,.4-7.2,1.9-2.4,1.6-3.1,4.8-2.8,7.5.4,3.2,2.5,5,5.6,5.4.6,0,1.3.2,1.9.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta15 = walletMeta) === null || _walletMeta15 === void 0 ? void 0 : (_walletMeta15$colors = _walletMeta15.colors) === null || _walletMeta15$colors === void 0 ? void 0 : _walletMeta15$colors.secondary) || "#000000",
    d: "M651.3,201.4c3.9.6,8.1.5,12,.2,3.5-.3,8-.8,10-4.2,1.6-2.6,1.7-6.5-.7-8.7-1.1-1-2.6-1.5-4.1-1.7-1.7-.3-3.4-.4-5.1-.5-3-.2-5.9-.1-8.9,0-2.5.1-5.1.2-7.4,1.5-2.5,1.5-3.3,4.7-3.1,7.4.2,3.2,2.3,5.1,5.3,5.7.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta16 = walletMeta) === null || _walletMeta16 === void 0 ? void 0 : (_walletMeta16$colors = _walletMeta16.colors) === null || _walletMeta16$colors === void 0 ? void 0 : _walletMeta16$colors.secondary) || "#000000",
    d: "M699,201.5c1.9.5,3.9.9,5.8,1.2,2,.3,4,.4,5.9.6,1.7.1,3.7.2,5.6-.2,1.8-.3,3.6-1,4.8-2.5,2-2.4,2.8-6.2.7-8.7-.9-1.2-2.3-1.9-3.8-2.4-1.6-.5-3.4-.9-5-1.2-2.9-.7-5.9-.9-8.9-1.2-2.6-.2-5.2-.4-7.6.6-2.7,1.2-3.8,4.3-3.9,7-.1,3.2,1.7,5.3,4.6,6.2.6.2,1.2.4,1.8.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta17 = walletMeta) === null || _walletMeta17 === void 0 ? void 0 : (_walletMeta17$colors = _walletMeta17.colors) === null || _walletMeta17$colors === void 0 ? void 0 : _walletMeta17$colors.secondary) || "#000000",
    d: "M745.5,209.3c1.7.9,3.6,1.6,5.4,2.4,1.8.7,3.7,1.3,5.5,1.8,3.3,1,7.5,2.1,10.7-.2,2.5-1.8,4.1-5.3,2.8-8.3-.6-1.4-1.8-2.4-3.2-3.2-1.5-.9-3.1-1.6-4.7-2.4-2.8-1.3-5.6-2.2-8.5-3.1-2.5-.7-5-1.6-7.6-1-2.9.7-4.6,3.4-5.3,6.1-.7,3.1.6,5.5,3.2,7,.5.3,1.1.6,1.7.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta18 = walletMeta) === null || _walletMeta18 === void 0 ? void 0 : (_walletMeta18$colors = _walletMeta18.colors) === null || _walletMeta18$colors === void 0 ? void 0 : _walletMeta18$colors.secondary) || "#000000",
    d: "M788.1,227.8c2.7,2.7,6,5,9,7.2.7.5,1.5,1,2.3,1.4.8.5,1.6.9,2.4,1.3,1.7.7,3.5,1,5.4.4,2.9-.9,5.6-3.7,5.3-7-.2-1.5-1-2.8-2-4-.6-.7-1.2-1.3-1.8-2-.6-.6-1.3-1.2-2-1.8-1.1-1-2.3-2-3.5-3-1.2-.9-2.5-1.8-3.8-2.6-1.1-.7-2.2-1.5-3.4-2.1-1.2-.6-2.4-1-3.8-1.1-3-.2-5.4,2-6.7,4.4-1.5,2.8-.9,5.5,1.1,7.6.4.4.9.9,1.3,1.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta19 = walletMeta) === null || _walletMeta19 === void 0 ? void 0 : (_walletMeta19$colors = _walletMeta19.colors) === null || _walletMeta19$colors === void 0 ? void 0 : _walletMeta19$colors.secondary) || "#000000",
    d: "M822.3,258.6c1.7,3.5,4,6.8,6.2,9.8.5.7,1.1,1.4,1.7,2.1.6.7,1.2,1.4,1.9,2,1.4,1.2,3.1,2,5,2.1,3,0,6.5-1.7,7.2-5,.3-1.5,0-3-.6-4.4-.6-1.6-1.5-3.2-2.3-4.7-.7-1.3-1.5-2.6-2.3-3.9-.8-1.3-1.8-2.5-2.7-3.7-1.5-2.1-3.2-4.3-5.6-5.3-2.7-1.2-5.8,0-7.8,1.9-1.2,1.1-1.8,2.3-2.1,3.6-.2,1.3,0,2.7.6,4,.3.6.5,1.1.8,1.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta20 = walletMeta) === null || _walletMeta20 === void 0 ? void 0 : (_walletMeta20$colors = _walletMeta20.colors) === null || _walletMeta20$colors === void 0 ? void 0 : _walletMeta20$colors.secondary) || "#000000",
    d: "M845.7,299c.4,1.9.9,3.9,1.5,5.7.7,1.9,1.3,3.8,2.1,5.5.7,1.6,1.5,3.4,2.6,4.9,1.1,1.5,2.6,2.7,4.4,3.2,3,.7,6.7-.3,8.1-3.3.6-1.4.6-2.9.4-4.4-.3-1.7-.7-3.4-1.1-5.1-.8-2.9-1.8-5.7-2.9-8.5-.5-1.2-1-2.4-1.6-3.5-.6-1.1-1.4-2.2-2.4-3-2.3-1.9-5.5-1.5-8-.3-2.9,1.3-4,4-3.5,6.9,0,.6.2,1.2.3,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta21 = walletMeta) === null || _walletMeta21 === void 0 ? void 0 : (_walletMeta21$colors = _walletMeta21.colors) === null || _walletMeta21$colors === void 0 ? void 0 : _walletMeta21$colors.secondary) || "#000000",
    d: "M860.1,344.1c.1,4,.9,8.1,1.9,11.8,1,3.4,2.2,7.7,5.9,9.1,2.9,1.1,6.7.5,8.5-2.2.8-1.3,1-2.8,1-4.3,0-1.7-.2-3.4-.4-5.1-.3-2.9-.9-5.9-1.6-8.7-.6-2.5-1.1-5-2.8-7-1.9-2.2-5.2-2.4-7.9-1.7-3.1.8-4.6,3.2-4.6,6.2,0,.6,0,1.3,0,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta22 = walletMeta) === null || _walletMeta22 === void 0 ? void 0 : (_walletMeta22$colors = _walletMeta22.colors) === null || _walletMeta22$colors === void 0 ? void 0 : _walletMeta22$colors.secondary) || "#000000",
    d: "M869,391.4c-.2,4,.3,8.2,1,12,.7,3.5,1.8,7.9,5.4,9.5,2.8,1.2,6.7.8,8.6-1.8.9-1.2,1.2-2.7,1.2-4.2,0-1.7,0-3.4-.1-5.1-.1-2.9-.5-5.8-1-8.7-.4-2.5-.7-5-2.2-7.1-1.7-2.4-5-2.8-7.7-2.4-3.1.5-4.8,2.8-5.1,5.8,0,.6-.1,1.3-.1,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta23 = walletMeta) === null || _walletMeta23 === void 0 ? void 0 : (_walletMeta23$colors = _walletMeta23.colors) === null || _walletMeta23$colors === void 0 ? void 0 : _walletMeta23$colors.secondary) || "#000000",
    d: "M875.5,439.3c-.3,4,0,8.2.7,12.1.6,3.5,1.5,8,5.1,9.7,2.8,1.3,6.7,1.1,8.6-1.5.9-1.2,1.2-2.7,1.4-4.2.1-1.7,0-3.4,0-5.1,0-2.9-.4-5.8-.7-8.7-.3-2.5-.5-5-2-7.2-1.6-2.4-4.9-3-7.6-2.6-3.1.4-4.9,2.6-5.3,5.6,0,.6-.1,1.3-.2,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta24 = walletMeta) === null || _walletMeta24 === void 0 ? void 0 : (_walletMeta24$colors = _walletMeta24.colors) === null || _walletMeta24$colors === void 0 ? void 0 : _walletMeta24$colors.secondary) || "#000000",
    d: "M880.4,487.5c-.4,4-.2,8.2.3,12.1.5,3.5,1.3,8,4.8,9.8,2.7,1.4,6.6,1.3,8.7-1.2.9-1.1,1.3-2.6,1.5-4.1.2-1.7.2-3.4.2-5.1,0-2.9-.1-5.9-.4-8.8-.2-2.5-.4-5.1-1.8-7.3-1.6-2.5-4.8-3.1-7.5-2.9-3.2.3-5,2.4-5.5,5.5-.1.6-.2,1.3-.3,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta25 = walletMeta) === null || _walletMeta25 === void 0 ? void 0 : (_walletMeta25$colors = _walletMeta25.colors) === null || _walletMeta25$colors === void 0 ? void 0 : _walletMeta25$colors.secondary) || "#000000",
    d: "M883.8,535.8c-.6,4-.5,8.2-.1,12.1.4,3.6,1,8,4.5,10,2.7,1.5,6.6,1.5,8.7-1,1-1.1,1.4-2.6,1.6-4.1.2-1.7.3-3.4.4-5.1.2-2.9,0-5.9-.1-8.8-.2-2.5-.2-5.1-1.5-7.3-1.5-2.5-4.7-3.3-7.4-3.1-3.2.2-5.1,2.3-5.7,5.3-.1.6-.2,1.3-.3,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta26 = walletMeta) === null || _walletMeta26 === void 0 ? void 0 : (_walletMeta26$colors = _walletMeta26.colors) === null || _walletMeta26$colors === void 0 ? void 0 : _walletMeta26$colors.secondary) || "#000000",
    d: "M885.6,584.1c-.7,3.9-.8,8.2-.5,12.1.3,3.6.7,8.1,4.1,10.1,2.6,1.6,6.5,1.7,8.7-.7,1-1.1,1.5-2.5,1.8-4,.3-1.7.4-3.4.6-5,.2-2.9.2-5.9.2-8.8,0-2.5,0-5.1-1.3-7.4-1.4-2.6-4.5-3.4-7.3-3.4-3.2.1-5.2,2.1-5.9,5.1-.1.6-.3,1.3-.4,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta27 = walletMeta) === null || _walletMeta27 === void 0 ? void 0 : (_walletMeta27$colors = _walletMeta27.colors) === null || _walletMeta27$colors === void 0 ? void 0 : _walletMeta27$colors.secondary) || "#000000",
    d: "M885.9,632.6c-.8,3.9-1,8.1-.9,12,.1,3.5.4,8,3.7,10.2,2.5,1.7,6.4,2,8.8-.2,1.1-1,1.6-2.5,1.9-4,.3-1.7.5-3.4.8-5.1.4-2.9.5-5.9.5-8.8,0-2.5.1-5.1-1-7.4-1.3-2.6-4.4-3.6-7.2-3.6-3.2,0-5.2,2-6,4.9-.2.6-.3,1.2-.4,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta28 = walletMeta) === null || _walletMeta28 === void 0 ? void 0 : (_walletMeta28$colors = _walletMeta28.colors) === null || _walletMeta28$colors === void 0 ? void 0 : _walletMeta28$colors.secondary) || "#000000",
    d: "M883.3,680.3c-1.2,3.7-2,7.8-2.4,11.6-.2,1.7-.4,3.7-.2,5.5.2,1.9.8,3.6,2.2,5,2.2,2.1,6,3.1,8.7,1.2,1.2-.9,2-2.2,2.6-3.6.6-1.6,1.1-3.3,1.5-5,.8-2.9,1.3-5.9,1.6-8.9.4-2.6.7-5.1-.2-7.6-1.1-2.8-4.1-4-6.8-4.3-3.2-.3-5.4,1.4-6.5,4.3-.2.6-.4,1.2-.6,1.8Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta29 = walletMeta) === null || _walletMeta29 === void 0 ? void 0 : (_walletMeta29$colors = _walletMeta29.colors) === null || _walletMeta29$colors === void 0 ? void 0 : _walletMeta29$colors.secondary) || "#000000",
    d: "M872.6,725.9c-1,1.6-2,3.3-2.8,5.1-.9,1.7-1.7,3.5-2.3,5.2-.7,1.6-1.4,3.3-1.7,5.2-.4,1.8-.3,3.6.7,5.4.8,1.3,1.9,2.5,3.3,3.3,1.4.7,3,1,4.6.5,1.4-.5,2.6-1.6,3.6-2.8,1.1-1.4,2-2.9,2.9-4.4,1.6-2.6,2.9-5.4,4-8.3,1-2.4,2-4.9,1.7-7.6-.4-3-3-4.9-5.7-5.8-1.5-.5-2.9-.4-4.1,0-1.2.5-2.3,1.4-3.1,2.6-.4.5-.7,1-1,1.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta30 = walletMeta) === null || _walletMeta30 === void 0 ? void 0 : (_walletMeta30$colors = _walletMeta30.colors) === null || _walletMeta30$colors === void 0 ? void 0 : _walletMeta30$colors.secondary) || "#000000",
    d: "M849.1,765.4c-1.5,1.2-3,2.4-4.4,3.8-1.4,1.4-2.8,2.7-4,4.1-.6.6-1.2,1.3-1.7,2-.6.7-1.2,1.4-1.6,2.2-.9,1.6-1.5,3.4-1.2,5.3.5,3,2.8,6.1,6.1,6.3,1.5,0,3-.6,4.3-1.4.7-.5,1.5-1,2.2-1.5.7-.5,1.4-1.1,2.1-1.7,1.2-1,2.3-2,3.5-3,1.1-1.1,2.1-2.2,3.2-3.3.9-1,1.8-2,2.6-3,.8-1.1,1.4-2.2,1.7-3.5.6-3-1.2-5.7-3.4-7.3-1.3-1-2.6-1.4-3.9-1.4-1.3,0-2.6.5-3.8,1.3-.5.3-1,.7-1.5,1.1Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta31 = walletMeta) === null || _walletMeta31 === void 0 ? void 0 : (_walletMeta31$colors = _walletMeta31.colors) === null || _walletMeta31$colors === void 0 ? void 0 : _walletMeta31$colors.secondary) || "#000000",
    d: "M813.4,794.9c-3.7,1.3-7.3,3.2-10.6,5.1-.7.4-1.5.9-2.3,1.5-.8.5-1.5,1.1-2.2,1.7-1.4,1.3-2.4,2.9-2.6,4.8-.3,3,1.1,6.6,4.3,7.7,1.4.4,3,.2,4.4-.2,1.7-.5,3.3-1.1,4.9-1.8,1.4-.6,2.8-1.2,4.1-1.9,1.4-.7,2.7-1.5,4-2.2,1.1-.7,2.3-1.3,3.3-2.1,1-.8,2-1.7,2.6-2.8,1.6-2.5.7-5.7-.9-8-1.7-2.6-4.5-3.3-7.3-2.5-.6.2-1.2.4-1.8.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta32 = walletMeta) === null || _walletMeta32 === void 0 ? void 0 : (_walletMeta32$colors = _walletMeta32.colors) === null || _walletMeta32$colors === void 0 ? void 0 : _walletMeta32$colors.secondary) || "#000000",
    d: "M770.6,814.6c-1.9.3-3.9.7-5.9,1.2-1.9.5-3.8,1.2-5.6,1.8-1.7.6-3.5,1.4-5.1,2.4-1.6,1-2.9,2.4-3.4,4.3-.8,3,0,6.7,3,8.3,1.3.7,2.9.8,4.4.6,1.7-.2,3.4-.6,5.1-.9,2.9-.6,5.8-1.5,8.6-2.5,2.4-.8,4.9-1.6,6.7-3.5,2-2.1,1.8-5.5.8-8-1.1-3-3.7-4.2-6.7-3.9-.6,0-1.3.1-1.9.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta33 = walletMeta) === null || _walletMeta33 === void 0 ? void 0 : (_walletMeta33$colors = _walletMeta33.colors) === null || _walletMeta33$colors === void 0 ? void 0 : _walletMeta33$colors.secondary) || "#000000",
    d: "M724.5,827.7c-4,.2-8.1,1-11.9,2.2-3.4,1-7.7,2.5-9,6.2-1,2.9-.2,6.7,2.6,8.4,1.3.7,2.8.9,4.3.8,1.7,0,3.4-.3,5.1-.6,2.9-.4,5.8-1.1,8.6-1.8,2.4-.6,4.9-1.1,6.9-2.9,2.2-1.9,2.3-5.2,1.6-7.9-.8-3.1-3.2-4.6-6.3-4.6-.6,0-1.3,0-1.9,0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta34 = walletMeta) === null || _walletMeta34 === void 0 ? void 0 : (_walletMeta34$colors = _walletMeta34.colors) === null || _walletMeta34$colors === void 0 ? void 0 : _walletMeta34$colors.secondary) || "#000000",
    d: "M677.4,838.5c-4,0-8.2.7-12,1.7-3.5.9-7.8,2.2-9.2,5.9-1.1,2.9-.5,6.7,2.2,8.5,1.2.8,2.8,1,4.3,1,1.7,0,3.4-.2,5.1-.4,2.9-.3,5.8-.8,8.7-1.5,2.5-.5,5-.9,7-2.6,2.3-1.9,2.6-5.1,2-7.8-.7-3.1-3-4.7-6.1-4.8-.6,0-1.3,0-1.9,0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta35 = walletMeta) === null || _walletMeta35 === void 0 ? void 0 : (_walletMeta35$colors = _walletMeta35.colors) === null || _walletMeta35$colors === void 0 ? void 0 : _walletMeta35$colors.secondary) || "#000000",
    d: "M629.8,847.5c-4,0-8.2.4-12,1.3-3.5.8-7.9,1.9-9.4,5.6-1.2,2.8-.7,6.7,2,8.5,1.2.8,2.7,1.1,4.2,1.1,1.7,0,3.4,0,5.1-.2,2.9-.2,5.8-.6,8.7-1.1,2.5-.4,5-.8,7.1-2.3,2.3-1.8,2.7-5,2.2-7.7-.6-3.1-2.8-4.8-5.9-5-.6,0-1.3,0-1.9,0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta36 = walletMeta) === null || _walletMeta36 === void 0 ? void 0 : (_walletMeta36$colors = _walletMeta36.colors) === null || _walletMeta36$colors === void 0 ? void 0 : _walletMeta36$colors.secondary) || "#000000",
    d: "M582,854.8c-4-.2-8.2.2-12.1.9-3.5.7-7.9,1.7-9.6,5.3-1.3,2.8-.9,6.7,1.7,8.6,1.2.9,2.7,1.2,4.2,1.3,1.7,0,3.4,0,5.1,0,2.9,0,5.8-.5,8.7-.9,2.5-.3,5-.6,7.2-2.1,2.4-1.7,2.9-4.9,2.5-7.6-.5-3.1-2.7-4.9-5.7-5.2-.6,0-1.3-.1-1.9-.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta37 = walletMeta) === null || _walletMeta37 === void 0 ? void 0 : (_walletMeta37$colors = _walletMeta37.colors) === null || _walletMeta37$colors === void 0 ? void 0 : _walletMeta37$colors.secondary) || "#000000",
    d: "M533.9,860.7c-4-.3-8.2,0-12.1.6-3.5.6-8,1.5-9.7,5-1.4,2.8-1.1,6.6,1.5,8.6,1.2.9,2.7,1.3,4.1,1.4,1.7.1,3.4.1,5.1,0,2.9,0,5.8-.3,8.8-.6,2.5-.3,5-.5,7.2-1.9,2.4-1.6,3-4.8,2.7-7.6-.4-3.2-2.5-5-5.6-5.4-.6,0-1.3-.2-1.9-.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta38 = walletMeta) === null || _walletMeta38 === void 0 ? void 0 : (_walletMeta38$colors = _walletMeta38.colors) === null || _walletMeta38$colors === void 0 ? void 0 : _walletMeta38$colors.secondary) || "#000000",
    d: "M485.8,865.2c-4-.6-8.2-.5-12.1,0-3.6.4-8.1,1.1-10,4.6-1.5,2.7-1.4,6.6,1.1,8.7,1.1,1,2.6,1.4,4.1,1.6,1.7.2,3.4.3,5,.3,2.9.1,5.8,0,8.8-.2,2.5-.2,5.1-.2,7.3-1.5,2.5-1.5,3.3-4.8,3-7.5-.1-1.6-.7-2.8-1.7-3.8-.9-.9-2.2-1.5-3.7-1.8-.6-.1-1.3-.2-1.9-.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta39 = walletMeta) === null || _walletMeta39 === void 0 ? void 0 : (_walletMeta39$colors = _walletMeta39.colors) === null || _walletMeta39$colors === void 0 ? void 0 : _walletMeta39$colors.secondary) || "#000000",
    d: "M437.3,867.7c-4-.6-8.2-.5-12.1-.1-3.6.4-8.1,1-10,4.5-1.5,2.7-1.5,6.6,1,8.7,1.1,1,2.6,1.4,4.1,1.6,1.7.2,3.4.3,5.1.4,2.9.2,5.8,0,8.8-.1,2.5-.1,5-.2,7.3-1.5,2.5-1.5,3.3-4.6,3.2-7.4-.2-3.2-2.2-5.1-5.3-5.7-.6-.1-1.3-.2-1.9-.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta40 = walletMeta) === null || _walletMeta40 === void 0 ? void 0 : (_walletMeta40$colors = _walletMeta40.colors) === null || _walletMeta40$colors === void 0 ? void 0 : _walletMeta40$colors.secondary) || "#000000",
    d: "M388.8,869.7c-4-.6-8.2-.7-12.1-.4-3.6.3-8.1.9-10.1,4.3-1.6,2.6-1.6,6.5.8,8.7,1.1,1,2.6,1.5,4,1.7,1.7.3,3.4.4,5.1.5,2.9.2,5.8.2,8.8,0,2.5,0,5.1,0,7.3-1.3,2.5-1.4,3.4-4.6,3.3-7.3-.1-3.2-2.2-5.1-5.2-5.8-.6-.1-1.3-.3-1.9-.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta41 = walletMeta) === null || _walletMeta41 === void 0 ? void 0 : (_walletMeta41$colors = _walletMeta41.colors) === null || _walletMeta41$colors === void 0 ? void 0 : _walletMeta41$colors.secondary) || "#000000",
    d: "M340.4,870.6c-3.9-.8-8.2-.9-12.1-.7-3.6.2-8.1.6-10.2,3.9-1.6,2.6-1.8,6.5.5,8.8,1.1,1,2.5,1.6,4,1.8,1.7.3,3.4.5,5,.6,2.9.3,5.9.4,8.8.3,2.5,0,5.1,0,7.4-1.1,2.6-1.3,3.5-4.5,3.5-7.2,0-3.2-2-5.2-5-6-.6-.2-1.3-.3-1.9-.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta42 = walletMeta) === null || _walletMeta42 === void 0 ? void 0 : (_walletMeta42$colors = _walletMeta42.colors) === null || _walletMeta42$colors === void 0 ? void 0 : _walletMeta42$colors.secondary) || "#000000",
    d: "M292,869.8c-3.9-.9-8.1-1.3-12-1.2-3.6,0-8.1.3-10.3,3.5-1.8,2.5-2.2,6.4,0,8.8,1,1.1,2.5,1.7,3.9,2,1.6.4,3.3.6,5,.8,2.9.4,5.8.6,8.8.7,2.5,0,5.1.3,7.4-.8,2.6-1.2,3.7-4.3,3.8-7.1,0-3.2-1.8-5.3-4.8-6.2-.6-.2-1.2-.4-1.9-.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta43 = walletMeta) === null || _walletMeta43 === void 0 ? void 0 : (_walletMeta43$colors = _walletMeta43.colors) === null || _walletMeta43$colors === void 0 ? void 0 : _walletMeta43$colors.secondary) || "#000000",
    d: "M243.9,866.6c-3.8-1.2-8-1.8-11.9-2-3.6-.2-8.1-.3-10.5,2.8-1.9,2.4-2.6,6.2-.5,8.8.9,1.1,2.3,1.8,3.8,2.3,1.6.5,3.3.8,5,1.2,2.9.6,5.8,1,8.7,1.3,2.5.3,5.1.6,7.5-.4,2.7-1.1,4-4.1,4.2-6.8.3-3.2-1.5-5.4-4.4-6.4-.6-.2-1.2-.4-1.8-.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta44 = walletMeta) === null || _walletMeta44 === void 0 ? void 0 : (_walletMeta44$colors = _walletMeta44.colors) === null || _walletMeta44$colors === void 0 ? void 0 : _walletMeta44$colors.secondary) || "#000000",
    d: "M196.2,860.3c-3.7-1.4-7.9-2.3-11.7-2.7-3.5-.4-8-.8-10.7,2.1-2.1,2.3-3,6.1-1,8.7.9,1.2,2.2,2,3.6,2.5,1.6.6,3.2,1,4.9,1.5,2.8.8,5.7,1.3,8.6,1.8,2.5.4,5,.9,7.5,0,2.8-.9,4.2-3.9,4.6-6.6.5-3.1-1.2-5.4-4-6.7-.6-.3-1.2-.5-1.8-.7Z"
  })), /*#__PURE__*/React.createElement("g", {
    opacity: "0.3"
  }, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta45 = walletMeta) === null || _walletMeta45 === void 0 ? void 0 : (_walletMeta45$colors = _walletMeta45.colors) === null || _walletMeta45$colors === void 0 ? void 0 : _walletMeta45$colors.secondary) || "#ffffff",
    d: "M89.1,346.5c-19,21.1-24.7,62.3-11.3,89.7,2.7,5.5,6.1,10.4,10.3,14.5,4.8,3.9,10.3,7.8,16.5,6.6,41.2-5.6,44.3-65.5,36.3-96.6-4.1-16-18.3-32.5-36.1-24.4-5.9,1.9-11.5,5.4-15.8,10.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta46 = walletMeta) === null || _walletMeta46 === void 0 ? void 0 : (_walletMeta46$colors = _walletMeta46.colors) === null || _walletMeta46$colors === void 0 ? void 0 : _walletMeta46$colors.secondary) || "#ffffff",
    d: "M90.3,495.7c-7.4,9.9-9.5,22.8-6.3,34.9,4.6,15.4,19.3,35.1,36.1,27,19-9.6,21-36.4,13.8-55.5-3.2-8.7-10.2-15.9-19.5-18.2-9.7-2-18.3,3.7-24.1,11.8Z"
  })), ((_walletMeta47 = walletMeta) === null || _walletMeta47 === void 0 ? void 0 : _walletMeta47.logo) && /*#__PURE__*/React.createElement(React.Fragment, null, ((_walletMeta48 = walletMeta) === null || _walletMeta48 === void 0 ? void 0 : (_walletMeta48$colors = _walletMeta48.colors) === null || _walletMeta48$colors === void 0 ? void 0 : _walletMeta48$colors.background) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "clipLogo"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "340",
    height: "340",
    rx: "80",
    ry: "80"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "310",
    y: "380",
    width: "340",
    height: "340",
    rx: "80",
    transform: "rotate(355 485 555)",
    fill: walletMeta.colors.background
  })), /*#__PURE__*/React.createElement("image", {
    style: {
      backgroundColor: (_walletMeta49 = walletMeta) !== null && _walletMeta49 !== void 0 && (_walletMeta49$colors = _walletMeta49.colors) !== null && _walletMeta49$colors !== void 0 && _walletMeta49$colors.background ? (_walletMeta50 = walletMeta) === null || _walletMeta50 === void 0 ? void 0 : (_walletMeta50$colors = _walletMeta50.colors) === null || _walletMeta50$colors === void 0 ? void 0 : _walletMeta50$colors.background : 'transparent',
      clipPath: "inset(0 round 60px)"
    },
    x: "310",
    y: "380",
    width: "340",
    height: "340",
    href: walletMeta.logo,
    transform: "rotate(355 485 555)",
    preserveAspectRatio: "xMidYMid meet"
  })), !((_walletMeta51 = walletMeta) !== null && _walletMeta51 !== void 0 && _walletMeta51.logo) && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M302.7,616.1c-2.3-18.4,9-36.6,26.2-42.5,13.3-4.5,27-.8,37.2,9,9.9,10.2,14.3,24.4,11.2,38.3-3.3,15.3-14.8,27.9-30,30.8-16.2,3-32.7-5.5-40.2-20.3-2.4-4.6-3.9-9.7-4.4-15.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    d: "M330.1,605.8c-.6-5.8,3-11,7.9-13.5,8.5-3.9,18.4,3,18,12.3-.2,4.8-2.9,9.2-7.1,11.3-4.6,2.5-10.4,2-14.2-1.3-2.5-2.1-4.2-5.2-4.5-8.8Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M574.2,590.3c-2.1-17.4,7.9-35.2,23.7-41.7,19.1-7.6,41,2.9,48.7,22.5,5.9,14.8,3.4,31.9-7.1,43.6-9.9,10.6-24.6,14.9-38.1,10.4-11.3-3.9-20.7-12.7-24.9-24.4-1.2-3.3-2-6.8-2.4-10.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    d: "M600.9,580.3c-.7-5.2,2.6-10.3,6.8-12.8,5.9-3.3,13.3-.9,16.8,4.2,3.6,5.5,2.6,13.1-2.8,17.4-4.8,3.5-11.9,4.2-16.3-.1-2.5-2.1-4.3-5.2-4.6-8.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    opacity: "0.2",
    d: "M379.4,671.4c-7.8-12.6-24.8-15.6-38.2-12.6,0,0-.1,0-.2,0,0,0-.1,0-.2,0-11.4,2.8-25.9,10.6-28.1,23.4-2.2,13.1,11.7,20.9,22.7,22.6,11.5,1.8,23.6-1,33.5-7,9.1-5.5,17-16,10.5-26.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    opacity: "0.2",
    d: "M653.3,654.3c-1-15.1-20.5-21.6-33-22.2,0,0-.1,0-.2,0,0,0-.1,0-.2,0-12.9-.3-26.2,4.5-33.2,15.9-2.8,4.6-4.1,10.1-1.9,15.2,2.1,4.9,6.6,8.4,11.3,10.8,10.2,5.2,22.7,6.3,33.8,3.6,10.5-2.5,24.3-10.8,23.5-23.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M499.2,614.9c-.5,0-.9.1-1.4.2-14.3,2.4-28.5,4.5-43,5.1-3.2.1-5.4,2.3-6.4,5.2-.5,1.4-.8,3-.7,4.6.4,9.5,10.2,10.1,17.6,9.5,10.3-1,20.7-1.6,30.7-4.6,4.3-1.3,10-3.2,12.3-7.4,2.5-4.5-.5-11.9-5.8-12.6-1.1-.1-2.2,0-3.3,0Z"
  })), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M1024.1,809c.3-.5.5-1.1.5-1.7,1.3-11.2,1.5-22.4.7-33.6-2-44.8-31.8-83.2-67.9-107.5-3.1-1.8-7.5-2.5-9.8,1.3-1.3,2.5-.6,5.5,1.7,6.8,8,5.6,15.5,11.6,22.5,18.2l-.3-.2c9.5,9.4,18.5,19.4,24.9,30.9v-.6c11.3,19.6,17.1,42.1,16.7,64.9,0,2.9,0,5.8-.3,8.7,0,1.5-.2,3.1-.3,4.6,0,.7-.1,1.4-.2,2.2,0,0,0,0,0,0,0,.4,0,.8-.1,1.3,0,.4,0,.9,0,1.3-4,.8-8.1,1.9-11.9,3.5-5.1,2.1-9.7,5.3-12.4,10.3-1.4,2.5-2.2,5.3-1.5,8.2.7,2.7,2.6,4.6,4.8,6.2.9.6,2,1.1,3.1,1.5-.6,8.1,1.4,16.8,7.9,22.2,7.8,6.5,19.1,6.9,27.2.9,8.8-6.4,12.4-18,10.2-28.5-1.8-8.5-7.7-16.5-15.4-20.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta52 = walletMeta) === null || _walletMeta52 === void 0 ? void 0 : (_walletMeta52$colors = _walletMeta52.colors) === null || _walletMeta52$colors === void 0 ? void 0 : _walletMeta52$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta53 = walletMeta) === null || _walletMeta53 === void 0 ? void 0 : (_walletMeta53$colors = _walletMeta53.colors) === null || _walletMeta53$colors === void 0 ? void 0 : _walletMeta53$colors.secondary) || "#000000"
    },
    d: "M465.8,702.9c-4.9-8.9-15.3-13.3-25-10.7-8.1,2.1-13.6,9.2-16.5,16.8-1.2-.2-2.4-.1-3.4,0-2.6.5-5.1,1.5-6.9,3.6-1.9,2.3-2.3,5.1-2.1,8,.3,4.9,2.6,9.3,5.7,13.1,2.7,3.3,5.8,5.8,9.2,7.6-11.1,19.6-27.6,36.3-48.7,44.9-17.7,7.3-38.9,9.3-57.3,3.5-10.2-3.2-19.6-9-25.8-17.8-2-2.9-5.5-4.5-8.9-2.7-2.8,1.5-4.7,6-2.7,8.9,13.8,19.6,36.7,28.1,60.1,27.9,25.3-.2,49.8-9.3,68.8-26,11.3-9.9,20.6-22.1,27.5-35.4,8.7,0,17.3-3.8,23.2-11.6,6.4-8.6,8-20.5,2.8-30Z"
  }));
});

var WhatIsAWalletDialog = (function (props) {
  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextCenter"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "What is a wallet?"))),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter PaddingLeftL PaddingRightL PaddingTopS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(QuestionsGraphic, null)), /*#__PURE__*/React.createElement("p", {
      className: "FontSizeM PaddingTopS PaddingLeftM PaddingRightM"
    }, "Wallets are used to send, receive, and store digital assets. Wallets come in many forms. They are either built into your browser, an extension added to your browser, an app on your phone, your computer or even a piece of hardware."), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("a", {
      className: "Link FontSizeM",
      href: "https://ethereum.org/wallets/",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "Learn more")))
  });
});

var ConnectStack = (function (props) {
  var _useContext = useContext(ClosableContext),
      open = _useContext.open,
      close = _useContext.close;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      wallet = _useState2[0],
      _setWallet = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      navigator = _useState4[0],
      _setNavigator = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      platform = _useState6[0],
      setPlatform = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      connectingExtension = _useState8[0],
      setConnectingExtension = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      connectingApp = _useState10[0],
      setConnectingApp = _useState10[1];

  var _useState11 = useState(),
      _useState12 = _slicedToArray(_useState11, 2),
      redirectUri = _useState12[0],
      setRedirectUri = _useState12[1];

  var _useState13 = useState(),
      _useState14 = _slicedToArray(_useState13, 2),
      connectionError = _useState14[0],
      setConnectionError = _useState14[1];

  var _useState15 = useState({
    blockchain: undefined
  }),
      _useState16 = _slicedToArray(_useState15, 2),
      selection = _useState16[0];
      _useState16[1];

  var _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      showConnectExtensionWarning = _useState18[0],
      setShowConnectExtensionWarning = _useState18[1];

  var resolve = function resolve(account, wallet) {
    var walletMeta = allWallets.find(function (walletMeta) {
      return walletMeta.name == wallet.name;
    });
    set(walletMeta.name);
    if (props.autoClose) close();
    if (props.resolve) props.resolve({
      account: account,
      wallet: wallet
    });
  };

  var connectExtension = function connectExtension(wallet, extension) {
    setShowConnectExtensionWarning(false);

    if (extension === undefined) {
      if (wallet.extensions && props.accept) {
        var availableExtensions = wallet.extensions.filter(function (availableExtension) {
          return props.accept.some(function (configuration) {
            return wallets[availableExtension].info.blockchains.includes(configuration.blockchain);
          });
        });

        if (availableExtensions.length === 1) {
          extension = availableExtensions[0];
        } else if (availableExtensions.length > 1) {
          setTimeout(function () {
            navigator.navigate('SelectPlatform');
          }, 50);
          return;
        }
      } else if (wallet.extensions && props.accept === undefined) {
        return navigator.navigate('SelectPlatform');
      } else {
        extension = wallet.extension;
      }
    }

    setConnectingExtension(true);
    wallet = new wallets[extension]();
    var resetConnectingTimeout = setTimeout(function () {
      setConnectingExtension(false);
    }, 5000);
    wallet.connect().then(function (account) {
      resolve(account, wallet);
      setConnectingExtension(false);
      clearTimeout(resetConnectingTimeout);
    })["catch"](function (error) {
      setConnectingExtension(false);
      clearTimeout(resetConnectingTimeout);

      if ((error === null || error === void 0 ? void 0 : error.code) == -32002) {
        // Request of type 'wallet_requestPermissions' already pending...
        setShowConnectExtensionWarning(true);
      } else if (typeof error === 'string') {
        setConnectionError(error);
      }
    });
  };

  var openUniversalLink = function openUniversalLink(platform, uri, name) {
    if (!platform.universal) {
      return;
    }

    var href = safeUniversalUrl(platform.universal);
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({
      href: href,
      name: name
    }));

    if (platform.encoded !== false) {
      href = "".concat(href, "/wc?uri=").concat(encodeURIComponent(uri));
    } else {
      href = "".concat(href, "/wc?uri=").concat(uri);
    }

    return window.open(href, '_self', 'noreferrer noopener');
  };

  var openNativeLink = function openNativeLink(platform, uri, name) {
    if (!platform["native"]) {
      return;
    }

    var href = safeAppUrl(platform["native"]);
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({
      href: href,
      name: name
    }));

    if (platform.encoded !== false) {
      href = "".concat(href, "wc?uri=").concat(encodeURIComponent(uri));
    } else {
      href = "".concat(href, "wc?uri=").concat(uri);
    }

    return window.open(href, '_self', 'noreferrer noopener');
  };

  var openWcLink = function openWcLink(platform, uri, name) {
    var href = 'wc://';
    localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify({
      href: href,
      name: name
    }));

    if (platform.encoded !== false) {
      href = "".concat(href, "wc?uri=").concat(encodeURIComponent(uri));
    } else {
      href = "".concat(href, "wc?uri=").concat(uri);
    }

    window.open(href, '_self', 'noreferrer noopener');
  };

  var redirect = function redirect(_ref) {
    var walletMetaData = _ref.walletMetaData,
        platform = _ref.platform,
        uri = _ref.uri;
    var name = isAndroid() ? 'Android' : walletMetaData.name;

    if (isWebView()) {
      if (platform.universal) {
        openUniversalLink(platform, uri, name);
      } else if (isAndroid()) {
        openWcLink(platform, uri, name);
      }
    } else {
      if (platform["native"]) {
        openNativeLink(platform, uri, name);
      } else {
        openUniversalLink(platform, uri, name);
      }
    }
  };

  var connectViaRedirect = function connectViaRedirect(walletMetaData) {
    var reconnect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var platform = platformForWallet(walletMetaData);

    if (!platform) {
      return;
    }

    setConnectingApp(true);
    setTimeout(function () {
      setConnectingApp(false);
    }, 15000);

    if (['WalletConnectV1', 'WalletConnectV2'].includes(platform.connect)) {
      localStorage[atob('ZGVwYXk6d2FsbGV0czp3YzI6cHJvamVjdElk')] = atob('YjFmYzJmMDZlYTIxMDdmY2Q5OWM2OGY0MTI3MTQxYWI=');

      var _wallet = new wallets[platform.connect]();

      if (redirectUri) {
        return redirect({
          walletMetaData: walletMetaData,
          platform: platform,
          uri: redirectUri
        });
      }

      setConnectionError();

      _wallet.connect({
        name: walletMetaData.name,
        logo: walletMetaData.logo,
        reconnect: reconnect,
        connect: function connect(_ref2) {
          var uri = _ref2.uri;
          setRedirectUri(uri);
          redirect({
            walletMetaData: walletMetaData,
            platform: platform,
            uri: uri
          });
        }
      }).then(function (account) {
        setConnectingApp(false);
        resolve(account, _wallet);
      })["catch"](function (error) {
        setConnectingApp(false);

        if (typeof error === 'string') {
          setConnectionError(error);
        }
      });
    } else if (platform.connect === 'SolanaMobileWalletAdapter') {
      var _wallet2 = new wallets[platform.connect]();

      setConnectionError();

      _wallet2.connect({
        name: walletMetaData.name,
        logo: walletMetaData.logo
      }).then(function (account) {
        setConnectingApp(false);
        resolve(account, _wallet2);
      })["catch"](function (error) {
        setConnectingApp(false);

        if (typeof error === 'string') {
          setConnectionError(error);
        }
      });
    }
  };

  var openInApp = function openInApp(walletMetaData) {
    var platform = platformForWallet(walletMetaData);

    if (!platform || !platform.open) {
      return;
    }

    set(walletMetaData.name);
    window.open(platform.open(), '_self', 'noreferrer noopener');
  };

  useEffect(function () {
    delete localStorage['WALLETCONNECT_DEEPLINK_CHOICE'];
  }, []);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ReactDialogStack, {
    open: open,
    close: close,
    start: "SelectWallet",
    container: props.container,
    document: props.document,
    setNavigator: function setNavigator(navigator) {
      if (props.setNavigator && navigator) {
        _setNavigator(navigator);
      }

      if (navigator) {
        _setNavigator(navigator);
      }
    },
    stacked: props.stacked,
    dialogs: {
      SelectWallet: /*#__PURE__*/React.createElement(SelectWalletDialog, {
        setWallet: function setWallet(walletMetaData) {
          setPlatform(platformForWallet(walletMetaData));

          _setWallet(walletMetaData);
        },
        resolve: resolve,
        openInApp: openInApp,
        connectViaRedirect: connectViaRedirect,
        connectExtension: connectExtension
      }),
      WhatIsAWallet: /*#__PURE__*/React.createElement(WhatIsAWalletDialog, null),
      SelectPlatform: /*#__PURE__*/React.createElement(SelectPlatformDialog, {
        onSelect: function onSelect(extension) {
          navigator.navigate('back');
          connectExtension(wallet, extension);
        },
        wallet: wallet,
        accept: props.accept
      }),
      ConnectWallet: /*#__PURE__*/React.createElement(ConnectWalletDialog, {
        selection: selection,
        accept: props.accept,
        wallet: wallet,
        platform: platform,
        resolve: resolve,
        openInApp: openInApp,
        connectViaRedirect: connectViaRedirect,
        connectExtension: connectExtension,
        connectingExtension: connectingExtension,
        connectingApp: connectingApp,
        showConnectExtensionWarning: showConnectExtensionWarning,
        connectionError: connectionError,
        setSolanaPayWallet: props.setSolanaPayWallet
      })
    }
  }), /*#__PURE__*/React.createElement(PoweredBy, null));
});

var ensureDocument = (function (document) {
  if (typeof document === 'undefined') {
    return window.document;
  } else {
    return document;
  }
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

var ErrorContext = /*#__PURE__*/React.createContext();

var ErrorGraphic = (function (props) {
  var _walletMeta, _walletMeta2, _walletMeta2$colors, _walletMeta3, _walletMeta3$colors, _walletMeta4, _walletMeta4$colors, _walletMeta5, _walletMeta5$colors, _walletMeta6, _walletMeta6$colors, _walletMeta7, _walletMeta7$colors, _walletMeta8, _walletMeta8$colors, _walletMeta9, _walletMeta9$colors, _walletMeta10, _walletMeta10$colors, _walletMeta11, _walletMeta11$colors, _walletMeta12, _walletMeta12$colors, _walletMeta13, _walletMeta13$colors, _walletMeta14, _walletMeta14$colors, _walletMeta15, _walletMeta15$colors, _walletMeta16, _walletMeta16$colors, _walletMeta17, _walletMeta17$colors, _walletMeta18, _walletMeta18$colors, _walletMeta19, _walletMeta19$colors, _walletMeta20, _walletMeta20$colors, _walletMeta21, _walletMeta21$colors, _walletMeta22, _walletMeta22$colors, _walletMeta23, _walletMeta23$colors, _walletMeta24, _walletMeta24$colors, _walletMeta25, _walletMeta25$colors, _walletMeta26, _walletMeta26$colors, _walletMeta27, _walletMeta27$colors, _walletMeta28, _walletMeta28$colors, _walletMeta29, _walletMeta29$colors, _walletMeta30, _walletMeta30$colors, _walletMeta31, _walletMeta31$colors, _walletMeta32, _walletMeta32$colors, _walletMeta33, _walletMeta33$colors, _walletMeta34, _walletMeta34$colors, _walletMeta35, _walletMeta35$colors, _walletMeta36, _walletMeta36$colors, _walletMeta37, _walletMeta37$colors, _walletMeta38, _walletMeta38$colors, _walletMeta39, _walletMeta39$colors, _walletMeta40, _walletMeta40$colors, _walletMeta41, _walletMeta41$colors, _walletMeta42, _walletMeta42$colors, _walletMeta43, _walletMeta43$colors, _walletMeta44, _walletMeta44$colors, _walletMeta45, _walletMeta45$colors, _walletMeta46, _walletMeta46$colors, _walletMeta47, _walletMeta47$colors, _walletMeta48, _walletMeta48$colors, _walletMeta49, _walletMeta49$colors, _walletMeta50, _walletMeta50$colors, _walletMeta51, _walletMeta51$colors, _walletMeta52, _walletMeta52$colors, _walletMeta53, _walletMeta53$colors, _walletMeta54, _walletMeta54$colors, _walletMeta55, _walletMeta55$colors, _walletMeta56, _walletMeta56$colors, _walletMeta57, _walletMeta57$colors, _walletMeta58, _walletMeta58$colors, _walletMeta59, _walletMeta59$colors, _walletMeta60, _walletMeta60$colors, _walletMeta61, _walletMeta61$colors, _walletMeta62, _walletMeta62$colors, _walletMeta63, _walletMeta63$colors, _walletMeta64, _walletMeta65, _walletMeta65$colors, _walletMeta66, _walletMeta66$colors, _walletMeta67;

  var walletctx = useContext(WalletContext);
  var wallet = (walletctx === null || walletctx === void 0 ? void 0 : walletctx.wallet) || (walletctx === null || walletctx === void 0 ? void 0 : walletctx.solanaPayWallet);
  var walletMeta = wallet ? allWallets.find(function (walletMeta) {
    return walletMeta.name == wallet.name;
  }) : undefined;

  if (!((_walletMeta = walletMeta) !== null && _walletMeta !== void 0 && _walletMeta.colors)) {
    walletMeta = undefined;
  }

  return /*#__PURE__*/React.createElement("svg", {
    className: "Graphic " + props.className,
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    x: "0px",
    y: "0px",
    viewBox: "0 0 1171.6 933.3"
  }, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    opacity: "0.5",
    className: "GraphicActiveColor",
    d: "M1128.6,796.2c-1.2-3.3-2-6.7-2.9-10.1-.2-.8-.5-1.7-.7-2.5-.2-.4-.3-.9-.5-1.4-.2-.5-.4-.9-.6-1.4-.2-.5-.4-.9-.5-1.4-1-2.5-2-5.6-3.2-8.1-.3-.4-.6-.9-.9-1.2-1.6-1.9-3.6-3-6.1-2.5-5.7,1.5-9.8,7.7-16,10.7-.5.3-1,.6-1.6,1-.5.3-1,.6-1.6.9,0-.2,0-.4.1-.6.6-2.8,1.3-5.5,1.9-8.2,1.1-4.7,2.1-9.8,1-14.6-.1-.7-.3-1.4-.6-2-1.3-3.2-5.4-3.2-7.7-1-.7.4-1.4.9-2.1,1.3-1.4.9-2.7,1.8-4.1,2.6-.6.3-1.1.7-1.7,1-4,2.5-8.2,3.5-12.8,5.1-.5-3.6-2.5-7.2-2.7-10.7,0-.6-.2-1.1-.3-1.7-.2-1.7-.3-3.4-.1-5.4.2-2-1.9-3.9-3.8-3.9-2.2,0-3.7,1.7-3.9,3.8-.3,3,0,6.1.7,9.2.1.8.3,1.5.5,2.3.9,4.2.4,9.4,3.5,12,5.6,6.2,14.9-.5,21.8-3.5.5-.3,1-.6,1.5-.9,1.5-.9,3-1.8,4.5-2.8,0,.3,0,.6,0,.9,0,.3,0,.6,0,.9,0,0,0,.1,0,.2,0,0,0,0,0,.1,0,.6-.2,1.3-.3,1.9-.3,1.4-.6,2.7-.9,4.1-1.3,5.3-2.9,10.8-2.7,16.3.1,3.1,3.1,4.5,5.8,3.3,2.3-1,4.5-2.2,6.6-3.4.7-.4,1.4-.8,2.1-1.3,1.8-1.5,4-2.3,6.2-3.1.4-.1.7-.3,1.1-.4,2.5-.9,5.6-4,8.2-.9,2.1,2.6,2.6,5.7,3.1,8.9.1.4.2.8.3,1.2.6,2.4,1.3,4.7,2.1,7.1.7,2,2.6,3.3,4.7,2.7,1.9-.5,3.4-2.8,2.7-4.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M1096.6,707.6c11.5-.9,23-1.8,34.4-2.7-1.8-2.4-3.6-4.8-5.5-7.1-2.2,7.6-4.3,15.3-6.5,22.9-1.1,3.8,1.2,7.5,5.5,7.1,11.4-.9,22.9-1.8,34.3-2.7,6.6-.5,5.2-10.8-1.4-10.2-11.4.9-22.9,1.8-34.3,2.7,1.8,2.4,3.6,4.8,5.5,7.1,2.2-7.6,4.3-15.3,6.5-22.9,1.1-3.8-1.2-7.5-5.5-7.1-11.5.9-23,1.8-34.4,2.7-6.6.5-5.2,10.8,1.4,10.2h0Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M1026.9,794c7.2,11.1,14.5,22.2,21.7,33.2,1-2.8,2.1-5.6,3.1-8.4-8.9,2.1-17.8,4.1-26.7,6.2-4,.9-5.3,5.1-3.1,8.4,7.2,11,14.5,22,21.7,33.1,1.5,2.3,5.3,2.4,7.3.7,2.4-1.9,2.3-4.9.7-7.3-7.2-11-14.5-22-21.7-33.1-1,2.8-2.1,5.6-3.1,8.4,8.9-2.1,17.8-4.1,26.7-6.2,4-.9,5.3-5.1,3.1-8.4-7.2-11.1-14.5-22.2-21.7-33.2-1.5-2.3-5.3-2.4-7.3-.7-2.4,1.9-2.3,4.9-.7,7.3h0Z"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    opacity: "0.5",
    className: "GraphicActiveColor",
    d: "M130.4,101.7c.7-3.7,1.8-7.3,2.8-11,.3-.9.5-1.8.7-2.7,0-.5.2-1,.3-1.5,0-.5.1-1.1.2-1.6,0-.5.2-1.1.2-1.6.4-2.9,1.2-6.3,1.4-9.3,0-.6,0-1.1-.2-1.7-.4-2.6-1.7-4.8-4.4-5.7-6.1-1.7-13.4,1.8-20.8,1.2-.7,0-1.3,0-2,0-.7,0-1.3,0-2,0,.1-.2.3-.3.4-.5,2-2.3,4.2-4.4,6.3-6.6,3.6-3.8,7.3-8,8.9-13,.2-.7.4-1.5.6-2.2.5-3.7-3.3-6-6.6-5.1-.9,0-1.8,0-2.6.1-1.8,0-3.5.1-5.3.2-.7,0-1.4,0-2.1,0-5.1.2-9.5-1.2-14.7-2.3,1.5-3.6,1.6-8.1,3.3-11.5.2-.6.5-1.2.7-1.7.7-1.7,1.6-3.4,2.8-5.1,1.3-1.8.4-4.7-1.5-5.7-2.1-1.1-4.4-.5-5.7,1.5-1.9,2.7-3.3,5.8-4.4,8.9-.3.8-.6,1.6-.8,2.4-1.4,4.4-4.8,8.9-3.3,13,1.9,8.9,14.2,7.8,22.3,8.7.6,0,1.3,0,1.9,0,1.9,0,3.8,0,5.7-.1-.2.3-.4.5-.5.8-.2.3-.4.5-.6.8,0,0,0,.1-.1.2,0,0,0,0,0,0-.4.5-.9,1.1-1.4,1.6-1,1.1-2,2.2-3.1,3.3-4.1,4.3-8.6,8.5-11.4,13.7-1.6,3,.4,5.9,3.6,6.3,2.7.3,5.3.4,8,.5.9,0,1.8,0,2.7,0,2.5-.4,5,0,7.5.5.4,0,.8.2,1.2.2,2.8.5,7.4-.6,8.1,3.7.5,3.5-.7,6.7-2,10-.1.4-.2.9-.4,1.3-.7,2.6-1.4,5.1-1.9,7.7-.4,2.2.6,4.5,2.9,5.1,2,.6,4.7-.7,5.1-2.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M86.4,190.2c-11.2,5.5-22.4,11-33.5,16.5,2.8,1.7,5.6,3.3,8.3,5-.9-8.5-1.8-17.1-2.7-25.6-.5-4.3-4.2-7-8.3-5-11.1,5.5-22.2,11-33.4,16.5-6.4,3.2-.9,12.9,5.5,9.7,11.1-5.5,22.2-11,33.4-16.5-2.8-1.7-5.6-3.3-8.3-5,.9,8.5,1.8,17.1,2.7,25.6.5,4.3,4.2,7,8.3,5,11.2-5.5,22.4-11,33.5-16.5,6.5-3.2.9-12.9-5.5-9.7h0Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M97.1,136.1c-13.3-5.4-26.5-10.8-39.8-16.2.8,3.1,1.6,6.2,2.4,9.4,6.7-7.3,13.3-14.6,20-21.9,3-3.3,1.6-7.8-2.4-9.4-13.2-5.4-26.4-10.7-39.6-16.1-2.8-1.1-6.1,1.1-6.9,3.8-.9,3.2,1,5.8,3.8,6.9,13.2,5.4,26.4,10.7,39.6,16.1-.8-3.1-1.6-6.2-2.4-9.4-6.7,7.3-13.3,14.6-20,21.9-3,3.3-1.6,7.7,2.4,9.4,13.3,5.4,26.5,10.8,39.8,16.2,2.8,1.1,6.1-1.1,6.9-3.8.9-3.2-1-5.8-3.8-6.9h0Z"
  })), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta2 = walletMeta) === null || _walletMeta2 === void 0 ? void 0 : (_walletMeta2$colors = _walletMeta2.colors) === null || _walletMeta2$colors === void 0 ? void 0 : _walletMeta2$colors.primary) || "#d88568",
    d: "M898.1,786.2c-186.5,31.3-391.2,20.5-578.4-1.5-7.4-.9-14.6-2-21.5-3.4-43-9.3-88.2-31.4-111.4-71-3.3-5.7-6.3-11.8-8.9-18.3-2.6-6.5-4.9-13.4-6.8-20.8-3.2-12.1-5.5-24.4-7.2-36.5-13.9-151.9-14.4-306.7,14.1-456.6,4.5-13.9,10.8-27.2,19.5-39.1,8.7-11.9,19.8-22.4,34.1-31,35-20.8,74.5-18.4,112.6-22.9,13.2-.9,26.5-1.6,39.8-2.2,118.2-5.4,236.6-6.2,354.9-2.6,83.1,2.5,176.9-9.6,252.1,32.9,80.2,45.4,90.7,134.8,94.4,216.4,3.5,78.4,1.7,157.1-6,235.2-6.2,63.5-12.9,130.3-66.3,174.8-30.4,25.4-70.9,39.1-114.9,46.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M875.5,780.1c-16.3,5.1-32.9,7-49.9,11.3-8.1,1.5-16.1,2.9-24.2,4.1-8,1.2-16,2.2-24,3-10.6,1-21.3,1.9-32,2.7-141.6,10.2-288.9,1.7-427.5-13.5-8.1-.9-16.3-1.8-24.3-2.9-49.6-8.7-105.9-26.8-133-72.9-3.3-5.6-6.3-11.6-8.9-18-2.6-6.4-4.9-13.2-6.8-20.4-3.2-11.9-5.5-24-7.2-35.9-13.9-149.3-14.4-301.4,14.1-448.8,4.5-13.7,10.8-26.7,19.5-38.4s19.8-22.1,34.1-30.5c35-20.4,74.5-18.1,112.6-22.5,13.2-.9,26.5-1.5,39.8-2.1,118.2-5.3,236.6-6.1,354.9-2.6,83.1,2.5,176.9-9.4,252.1,32.3,80.2,44.6,90.7,132.5,94.4,212.7,2.2,48.2,2.3,96.4.2,144.6-.4,9.6-.9,19.3-1.5,28.9-3.1,52.8-4,105.3-19.7,157-18.4,59.8-79.3,95.2-138.8,105.4-7.8,2.2-15.8,4.4-23.8,6.4Z"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M679.8,715.7c-.4,5.1-.7,10.2-1.3,15.3v-.3c0,.6,0,1.6-.1,2.4-.6,6-1.2,12-2,17.9-1.4,12.1-3.1,24.1-5,36.1-3.7,23.8-8,47.4-12.4,70.9-2.5,13.3-5.1,26.6-7.5,40-.8,4.4,1,9.6,4.2,10.7,3.2,1,6.6-1.4,7.4-6.1,8.9-47.6,18.6-95,24.6-143.6.9-7.1,1.7-14.2,2.4-21.4.7-7.2,1.3-14.4,1.8-21.6.3-4.6-3-9.1-6.1-8.9-3.6.2-5.7,3.8-6.1,8.8h0Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M657,903.9c1.4.8,2.8,1.5,4.3,2.2,1.5.7,3,1.2,4.6,1.8,5.6,1.2,13.1,2.9,19.8,2.7,1.7,0,3.3-.2,4.9-.6,1.1-.2,2.4-.6,3.7-1,1.3-.4,2.5-1,3.6-1.6,3.6-1.9,3.6-6,2.1-9.3-2.1-3.6-4.4-6.5-8-8.2-.9-.5-1.9-.9-2.9-1.2-8.9-3-19.2,0-26.1,7.2-.6.6-1.2,1.2-1.8,1.9-.7,1.7-2.5,2.6-3.2,4.2-.4.7-.7,1.3-1.1,2Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M654.4,908.4c3.8,2.2,8,4,12.3,4.9,4.3.9,8.7,1.7,13.1,2.2,4.6.4,9.2.2,13.7-.9,4.2-1.1,9.1-3,11.2-7,4.2-7.9-2.2-17.4-9-21.5-6.9-4.2-16-4.7-23.5-2-4.4,1.6-8.5,4-11.9,7.2-.7.7-1.4,1.4-2,2.1-.5.6-1.1,1.2-1.5,1.8-.1.3-.2.5-.4.7.4-.5.4-.5,0-.1-1.7,1.6-2.9,3.5-3.9,5.7-1.2,2.4-.8,5.7,1.9,7.1,2.3,1.2,5.8.8,7.1-1.9.3-.7.7-1.4,1.1-2,.1-.2.9-1.2,0-.3.2-.2.4-.4.6-.6.7-.7,1.3-1.4,1.9-2.3,0,0,.6-1.1.3-.5-.3.3-.2.2.2-.2.2-.2.5-.5.7-.7.5-.6,1.1-1.1,1.7-1.7.2-.2.5-.4.7-.6,0,0,1.1-.9.5-.5-.6.5.6-.4.6-.4.3-.2.6-.4.9-.6.7-.4,1.4-.9,2.2-1.2.4-.2.8-.4,1.2-.6-.2,0-.9.4,0,0,.7-.3,1.4-.5,2.1-.7.7-.2,1.4-.4,2.1-.5.3,0,.6-.1.9-.2.6,0,.6,0,0,0,.3,0,.6,0,.9,0,1.3-.1,2.6-.1,3.9,0,.2,0,1.6.3.3,0,.3,0,.6,0,.9.2.9.2,1.7.4,2.5.7-.1,0,1.5.5.8.3-.6-.3.9.5.8.4.7.3,1.3.7,1.9,1.1.8.5.1.1,0,0,.3.3.7.6,1,.9.2.2.4.4.6.6.1.1,1.1,1.3.7.8-.5-.6.4.6.4.6.2.3.3.5.5.8.3.4.5.8.7,1.2.6.9.1.1,0-.1.1.3.7,1.5.5,1.8,0-.2,0-.4,0-.6,0,.2,0,.5,0,.7,0,.1,0,.2,0,.4,0,.6,0,.5,0-.3,0,0-.1.7-.2.7,0-.2.2-.4.2-.6-.1.2-.2.4-.4.6.5-.9.3-.5,0-.2.1-.1.3-.2.4-.3-.2.2-.5.3-.7.4-.3.2-.6.3-.8.5,0,0-1.5.7-.6.3-.8.3-1.7.6-2.5.8-.9.2-1.7.4-2.6.6,0,0-1.7.2-.8.1-.4,0-.7,0-1.1,0-2,.1-3.9,0-5.9,0-1,0-2-.2-2.9-.3-1-.1,1.2.2-.5,0-.5,0-1-.2-1.6-.3-2-.3-4-.7-6-1.2-1.8-.4-3.5-.8-5.3-1.5-1.6-.6.4.2-.5-.2-.6-.2-1.1-.5-1.7-.8-1-.5-1.9-1-2.8-1.5-2.4-1.3-5.8-.6-7.1,1.9-1.3,2.5-.7,5.6,1.9,7.1Z"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M506.6,715.9c.2,3,.5,6,.7,9,.1,1.4.2,2.8.4,4.3,0,.6.1,1.3.2,1.9-.1-1.2.2,1.6.2,1.9.6,6,1.2,12,2,17.9,1.4,12.1,3.1,24.1,5,36.1,3.7,23.8,8,47.4,12.4,70.9,2.5,13.3,5.1,26.6,7.5,40,.8,4.4-1,9.6-4.2,10.7-3.2,1-6.6-1.4-7.4-6.1-8.9-47.6-18.6-95-24.6-143.6-.9-7.1-1.7-14.2-2.4-21.4-.7-7.2-1.3-14.3-1.8-21.5-.3-4.5,3-8.9,6-8.7,3.6.2,5.7,3.8,6.1,8.7h0Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M529.5,903.9c-1.4.8-2.8,1.5-4.3,2.2-1.5.7-3,1.2-4.6,1.8-5.6,1.2-13.1,2.9-19.8,2.7-1.7,0-3.3-.2-4.9-.6-1.1-.2-2.4-.6-3.7-1-1.3-.4-2.5-1-3.6-1.6-3.6-1.9-3.6-6-2.1-9.3,2.1-3.6,4.4-6.5,8-8.2.9-.5,1.9-.9,2.9-1.2,8.9-3,19.2,0,26.1,7.2.6.6,1.2,1.2,1.8,1.9.7,1.7,2.5,2.6,3.2,4.2.4.7.7,1.3,1.1,2Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "GraphicActiveColor",
    d: "M532.1,908.4c-3.8,2.2-8,4-12.3,4.9-4.3.9-8.7,1.7-13.1,2.2-4.6.4-9.2.2-13.7-.9-4.2-1.1-9.1-3-11.2-7-4.2-7.9,2.2-17.4,9-21.5,6.9-4.2,16-4.7,23.5-2,4.4,1.6,8.5,4,11.9,7.2.7.7,1.4,1.4,2,2.1.5.6,1.1,1.2,1.5,1.8.1.3.2.5.4.7-.4-.5-.4-.5,0-.1,1.7,1.6,2.9,3.5,3.9,5.7,1.2,2.4.8,5.7-1.9,7.1-2.3,1.2-5.8.8-7.1-1.9-.3-.7-.7-1.4-1.1-2-.1-.2-.9-1.2,0-.3-.2-.2-.4-.4-.6-.6-.7-.7-1.3-1.4-1.9-2.3,0,0-.6-1.1-.3-.5.3.3.2.2-.2-.2-.2-.2-.5-.5-.7-.7-.5-.6-1.1-1.1-1.7-1.7-.2-.2-.5-.4-.7-.6,0,0-1.1-.9-.5-.5.6.5-.6-.4-.6-.4-.3-.2-.6-.4-.9-.6-.7-.4-1.4-.9-2.2-1.2-.4-.2-.8-.4-1.2-.6.2,0,.9.4,0,0-.7-.3-1.4-.5-2.1-.7-.7-.2-1.4-.4-2.1-.5-.3,0-.6-.1-.9-.2-.6,0-.6,0,0,0-.3,0-.6,0-.9,0-1.3-.1-2.6-.1-3.9,0-.2,0-1.6.3-.3,0-.3,0-.6,0-.9.2-.9.2-1.7.4-2.5.7.1,0-1.5.5-.8.3.6-.3-.9.5-.8.4-.7.3-1.3.7-1.9,1.1-.8.5-.1.1,0,0-.3.3-.7.6-1,.9-.2.2-.4.4-.6.6-.1.1-1.1,1.3-.7.8.5-.6-.4.6-.4.6-.2.3-.3.5-.5.8-.3.4-.5.8-.7,1.2-.6.9-.1.1,0-.1-.1.3-.7,1.5-.5,1.8,0-.2,0-.4,0-.6,0,.2,0,.5,0,.7,0,.1,0,.2,0,.4,0,.6,0,.5,0-.3,0,0,.1.7.2.7,0-.2-.2-.4-.2-.6.1.2.2.4.4.6-.5-.9-.3-.5,0-.2-.1-.1-.3-.2-.4-.3.2.2.5.3.7.4.3.2.6.3.8.5,0,0,1.5.7.6.3.8.3,1.7.6,2.5.8.9.2,1.7.4,2.6.6,0,0,1.7.2.8.1.4,0,.7,0,1.1,0,2,.1,3.9,0,5.9,0,1,0,2-.2,2.9-.3,1-.1-1.2.2.5,0,.5,0,1-.2,1.6-.3,2-.3,4-.7,6-1.2,1.8-.4,3.5-.8,5.3-1.5,1.6-.6-.4.2.5-.2.6-.2,1.1-.5,1.7-.8,1-.5,1.9-1,2.8-1.5,2.4-1.3,5.8-.6,7.1,1.9,1.3,2.5.7,5.6-1.9,7.1Z"
  })), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta3 = walletMeta) === null || _walletMeta3 === void 0 ? void 0 : (_walletMeta3$colors = _walletMeta3.colors) === null || _walletMeta3$colors === void 0 ? void 0 : _walletMeta3$colors.primary) || "#d88568",
    style: {
      fill: ((_walletMeta4 = walletMeta) === null || _walletMeta4 === void 0 ? void 0 : (_walletMeta4$colors = _walletMeta4.colors) === null || _walletMeta4$colors === void 0 ? void 0 : _walletMeta4$colors.primary) || "#d88568"
    },
    d: "M851.8,803.5c-109.3,19-220.4,21.7-331,19.1-51.9-1.2-104.9-6.6-156.7-10.9-12.6-1-26.1-2-39.9-3.2-6.9-.6-13.9-1.3-20.9-2.1-59.2-8.6-125.6-28-156.6-82.7-3.3-6-6.2-12.2-8.7-18.6-2.5-6.4-4.6-12.9-6.3-19.4-3.2-12.4-5.5-25-7.1-37.4-12.6-142.2-13.4-285.5,7-427.1,6.5-45,19.4-87.2,60-112.5,33.6-20.7,76.5-21,114.8-23.2,48.5-2.8,97.1-4.7,145.7-6,89.6-2.3,179.2-1.9,268.7.8,75.3,2.2,155.2-5.9,223.1,33.8,79.5,46.5,89.9,138.1,93.5,221.7,3.5,80.3,1.6,160.9-6,241-6.2,65-12.8,133.5-65.7,179-30.1,26-70.2,40.1-113.8,47.7Z"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.5"
  }, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta5 = walletMeta) === null || _walletMeta5 === void 0 ? void 0 : (_walletMeta5$colors = _walletMeta5.colors) === null || _walletMeta5$colors === void 0 ? void 0 : _walletMeta5$colors.secondary) || "#000000",
    d: "M248.3,147.4c3.9-.3,8-1,11.8-2,1.7-.5,3.6-1.1,5.3-2,1.7-1,3.1-2.1,3.8-4,1.1-2.9.5-6.7-2.3-8.5-1.3-.8-2.8-1.1-4.3-1-1.7,0-3.4.3-5.1.5-2.9.4-5.9.9-8.7,1.6-2.5.7-5,1.2-7,3-2.2,2-2.3,5.2-1.6,7.9.9,3.1,3.3,4.6,6.3,4.6.6,0,1.3,0,1.9,0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta6 = walletMeta) === null || _walletMeta6 === void 0 ? void 0 : (_walletMeta6$colors = _walletMeta6.colors) === null || _walletMeta6$colors === void 0 ? void 0 : _walletMeta6$colors.secondary) || "#000000",
    d: "M295.4,138.5c4,.3,8.2,0,12-.8,3.5-.7,7.9-1.5,9.6-5.1,1.3-2.8,1.1-6.7-1.5-8.6-1.2-.9-2.7-1.3-4.2-1.4-1.7-.1-3.4-.1-5.1,0-2.9,0-5.9.4-8.8.8-2.5.3-5.1.6-7.2,2.1-2.4,1.7-2.9,5-2.5,7.7.5,3.1,2.7,4.9,5.7,5.2.6,0,1.3.1,1.9.1Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta7 = walletMeta) === null || _walletMeta7 === void 0 ? void 0 : (_walletMeta7$colors = _walletMeta7.colors) === null || _walletMeta7$colors === void 0 ? void 0 : _walletMeta7$colors.secondary) || "#000000",
    d: "M343.3,133.7c4,.5,8.2.4,12.1,0,3.6-.4,8-1.1,9.9-4.6,1.5-2.7,1.4-6.6-1.1-8.7-1.1-1-2.6-1.4-4.1-1.6-1.7-.2-3.4-.3-5.1-.3-2.9-.1-5.9,0-8.8.3-2.5.2-5.1.3-7.3,1.6-2.5,1.5-3.2,4.7-3,7.5.3,3.2,2.4,5,5.4,5.6.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta8 = walletMeta) === null || _walletMeta8 === void 0 ? void 0 : (_walletMeta8$colors = _walletMeta8.colors) === null || _walletMeta8$colors === void 0 ? void 0 : _walletMeta8$colors.secondary) || "#000000",
    d: "M391.7,131.1c4,.6,8.2.6,12.2.2,3.6-.3,8.1-1,10-4.4,1.5-2.7,1.5-6.6-1-8.7-1.1-1-2.6-1.4-4-1.6-1.7-.2-3.4-.3-5-.4-2.9-.2-5.8,0-8.7,0-2.5.1-5,.1-7.3,1.4-2.5,1.4-3.4,4.6-3.2,7.4.2,3.2,2.2,5.1,5.2,5.8.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta9 = walletMeta) === null || _walletMeta9 === void 0 ? void 0 : (_walletMeta9$colors = _walletMeta9.colors) === null || _walletMeta9$colors === void 0 ? void 0 : _walletMeta9$colors.secondary) || "#000000",
    d: "M440.3,129c4,.6,8.2.5,12.1,0,3.6-.5,8-.9,10-4.3,1.5-2.6,1.5-6.5-1-8.7-1.1-1-2.6-1.5-4.1-1.7-1.7-.3-3.4-.3-5.1-.4-2.9-.1-5.8,0-8.8.2-2.5.2-5,.2-7.3,1.5-2.5,1.5-3.3,4.6-3.2,7.4.2,3.2,2.2,5.1,5.3,5.7.6.1,1.3.2,1.9.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta10 = walletMeta) === null || _walletMeta10 === void 0 ? void 0 : (_walletMeta10$colors = _walletMeta10.colors) === null || _walletMeta10$colors === void 0 ? void 0 : _walletMeta10$colors.secondary) || "#000000",
    d: "M488.7,127.6c3.9.7,8.2.8,12.1.5,3.6-.3,8.1-.8,10.1-4.2,1.6-2.6,1.7-6.5-.7-8.7-1.1-1-2.5-1.5-4-1.7-1.7-.3-3.4-.4-5-.5-2.9-.2-5.9-.2-8.8-.1-2.5,0-5.1,0-7.4,1.2-2.6,1.4-3.4,4.5-3.3,7.3.1,3.2,2.1,5.2,5.1,5.9.6.1,1.3.3,1.9.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta11 = walletMeta) === null || _walletMeta11 === void 0 ? void 0 : (_walletMeta11$colors = _walletMeta11.colors) === null || _walletMeta11$colors === void 0 ? void 0 : _walletMeta11$colors.secondary) || "#000000",
    d: "M537.2,127.1c3.9.8,8.2.9,12.1.7,3.6-.2,8.1-.6,10.2-4,1.6-2.6,1.8-6.5-.6-8.7-1.1-1-2.5-1.5-4-1.8-1.7-.3-3.4-.4-5-.6-2.9-.3-5.8-.3-8.7-.3-2.5,0-5,0-7.4,1.1-2.6,1.3-3.5,4.5-3.5,7.2,0,3.2,2,5.2,5,6,.6.2,1.3.3,1.9.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta12 = walletMeta) === null || _walletMeta12 === void 0 ? void 0 : (_walletMeta12$colors = _walletMeta12.colors) === null || _walletMeta12$colors === void 0 ? void 0 : _walletMeta12$colors.secondary) || "#000000",
    d: "M585.8,127.4c3.9.8,8.2,1,12.1.9,3.6-.2,8.1-.5,10.2-3.9,1.7-2.6,1.8-6.5-.5-8.8-1.1-1-2.5-1.6-4-1.8-1.6-.3-3.3-.5-5-.7-2.9-.3-5.8-.4-8.7-.4-2.5,0-5-.1-7.4,1-2.6,1.3-3.6,4.4-3.6,7.2,0,3.2,1.9,5.2,4.9,6,.6.2,1.3.3,1.9.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta13 = walletMeta) === null || _walletMeta13 === void 0 ? void 0 : (_walletMeta13$colors = _walletMeta13.colors) === null || _walletMeta13$colors === void 0 ? void 0 : _walletMeta13$colors.secondary) || "#000000",
    d: "M634.3,128.2c3.9.9,8.2,1.1,12.1,1,3.6-.1,8.1-.5,10.3-3.8,1.7-2.6,1.9-6.5-.4-8.8-1-1-2.5-1.6-3.9-1.9-1.6-.3-3.3-.5-5-.7-2.9-.4-5.8-.5-8.7-.5-2.5,0-5-.2-7.4,1-2.6,1.3-3.6,4.4-3.7,7.1,0,3.2,1.9,5.3,4.8,6.1.6.2,1.2.3,1.9.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta14 = walletMeta) === null || _walletMeta14 === void 0 ? void 0 : (_walletMeta14$colors = _walletMeta14.colors) === null || _walletMeta14$colors === void 0 ? void 0 : _walletMeta14$colors.secondary) || "#000000",
    d: "M683,129.4c4,.8,8.3,1,12.2.8,3.6-.2,8.2-.7,10.2-4,1.6-2.6,1.7-6.5-.7-8.7-1.1-1-2.5-1.5-4-1.8-1.6-.3-3.3-.4-5-.6-2.9-.3-5.8-.3-8.7-.3-2.5,0-5-.1-7.3,1-2.6,1.3-3.6,4.4-3.7,7.1,0,3.2,1.9,5.3,4.9,6.1.6.2,1.3.3,1.9.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta15 = walletMeta) === null || _walletMeta15 === void 0 ? void 0 : (_walletMeta15$colors = _walletMeta15.colors) === null || _walletMeta15$colors === void 0 ? void 0 : _walletMeta15$colors.secondary) || "#000000",
    d: "M731.8,129.3c3.9.8,8.2.9,12.1.7,3.6-.2,8.1-.6,10.2-4,1.6-2.6,1.8-6.5-.5-8.8-1.1-1-2.5-1.6-4-1.8-1.7-.3-3.4-.5-5-.6-2.9-.3-5.8-.3-8.8-.3-2.5,0-5.1,0-7.4,1.2-2.6,1.4-3.5,4.5-3.5,7.2,0,3.2,2,5.2,5,6,.6.2,1.3.3,1.9.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta16 = walletMeta) === null || _walletMeta16 === void 0 ? void 0 : (_walletMeta16$colors = _walletMeta16.colors) === null || _walletMeta16$colors === void 0 ? void 0 : _walletMeta16$colors.secondary) || "#000000",
    d: "M780,130c3.9,1,8,1.3,11.9,1.4,3.5,0,8,0,10.4-3.2,1.8-2.4,2.4-6.3.2-8.8-1-1.1-2.4-1.7-3.9-2.1-1.6-.4-3.4-.7-5-1-2.9-.5-5.9-.7-8.8-.8-2.5-.1-5.1-.3-7.5.8-2.7,1.2-3.7,4.3-3.8,7.1,0,3.2,1.8,5.3,4.7,6.2.6.2,1.2.4,1.9.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta17 = walletMeta) === null || _walletMeta17 === void 0 ? void 0 : (_walletMeta17$colors = _walletMeta17.colors) === null || _walletMeta17$colors === void 0 ? void 0 : _walletMeta17$colors.secondary) || "#000000",
    d: "M827.5,134.9c1.8.7,3.8,1.3,5.7,1.8,1.9.5,3.9.8,5.8,1.2,1.7.3,3.7.5,5.6.4,1.9-.1,3.7-.6,5.1-2,2.2-2.1,3.4-5.9,1.6-8.6-.8-1.3-2.1-2.1-3.5-2.7-1.6-.7-3.3-1.2-4.9-1.7-2.8-1-5.8-1.5-8.7-2.1-2.5-.5-5.1-1-7.6-.2-2.8.9-4.2,3.9-4.6,6.6-.4,3.2,1.2,5.4,3.9,6.7.6.3,1.2.5,1.8.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta18 = walletMeta) === null || _walletMeta18 === void 0 ? void 0 : (_walletMeta18$colors = _walletMeta18.colors) === null || _walletMeta18$colors === void 0 ? void 0 : _walletMeta18$colors.secondary) || "#000000",
    d: "M873,147.2c1.6,1.1,3.4,2,5.1,2.9,1.8.9,3.6,1.7,5.3,2.3,3.2,1.3,7.3,2.8,10.6.9,2.6-1.6,4.7-4.9,3.6-8-.5-1.4-1.6-2.6-2.8-3.5-1.4-1-2.9-1.9-4.4-2.8-2.6-1.5-5.4-2.8-8.2-3.9-2.4-.9-4.8-2-7.5-1.7-3,.4-4.9,3-5.8,5.6-1,3,0,5.6,2.5,7.3.5.4,1,.7,1.6,1.1Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta19 = walletMeta) === null || _walletMeta19 === void 0 ? void 0 : (_walletMeta19$colors = _walletMeta19.colors) === null || _walletMeta19$colors === void 0 ? void 0 : _walletMeta19$colors.secondary) || "#000000",
    d: "M913.6,169.8c2.4,3,5.5,5.6,8.3,8,.7.5,1.4,1.1,2.1,1.6.7.6,1.5,1.1,2.3,1.5,1.6.9,3.4,1.3,5.4.9,2.9-.6,6-3.1,6-6.4,0-1.5-.7-2.9-1.6-4.2-.5-.7-1-1.4-1.6-2.1-.6-.7-1.2-1.3-1.8-2-1-1.1-2.1-2.2-3.2-3.3-1.1-1-2.3-2-3.5-3-1-.8-2-1.7-3.1-2.4-1.1-.7-2.3-1.2-3.6-1.5-3-.5-5.5,1.4-7.1,3.7-1.8,2.6-1.5,5.4.4,7.7.4.5.8,1,1.2,1.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta20 = walletMeta) === null || _walletMeta20 === void 0 ? void 0 : (_walletMeta20$colors = _walletMeta20.colors) === null || _walletMeta20$colors === void 0 ? void 0 : _walletMeta20$colors.secondary) || "#000000",
    d: "M944.6,203.9c1.4,3.6,3.3,7.1,5.2,10.4.4.7,1,1.5,1.5,2.3.5.8,1.1,1.5,1.7,2.2,1.3,1.3,2.9,2.3,4.8,2.6,3,.3,6.6-1.1,7.7-4.3.4-1.4.2-3-.2-4.5-.5-1.7-1.1-3.3-1.8-4.9-.6-1.4-1.3-2.8-1.9-4.1-.7-1.3-1.5-2.6-2.3-4-1.3-2.3-2.7-4.5-5.1-5.9-2.6-1.5-5.7-.5-8,1.1-1.3.9-2.1,2.1-2.4,3.3-.4,1.3-.3,2.7.2,4.1.2.6.4,1.2.6,1.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta21 = walletMeta) === null || _walletMeta21 === void 0 ? void 0 : (_walletMeta21$colors = _walletMeta21.colors) === null || _walletMeta21$colors === void 0 ? void 0 : _walletMeta21$colors.secondary) || "#000000",
    d: "M963.8,246.3c.2,1.9.5,3.9,1,5.9.5,1.9.9,3.9,1.5,5.7.6,1.7,1.2,3.5,2.1,5.2.9,1.6,2.3,3,4.1,3.6,2.9,1,6.7.4,8.4-2.5.8-1.3.9-2.8.8-4.4-.1-1.7-.3-3.5-.6-5.2-.5-3-1.2-5.9-2.1-8.8-.4-1.2-.7-2.5-1.2-3.7-.5-1.2-1.2-2.3-2.1-3.2-2.1-2.1-5.4-2-8-1.1-3,1.1-4.3,3.5-4.2,6.5,0,.6,0,1.3.2,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta22 = walletMeta) === null || _walletMeta22 === void 0 ? void 0 : (_walletMeta22$colors = _walletMeta22.colors) === null || _walletMeta22$colors === void 0 ? void 0 : _walletMeta22$colors.secondary) || "#000000",
    d: "M973.7,292.7c-.3,4,.1,8.1.7,11.9.6,3.5,1.4,7.9,5,9.6,2.7,1.4,6.6,1.2,8.7-1.4.9-1.2,1.3-2.7,1.4-4.2.1-1.7.1-3.4,0-5.1,0-3-.3-5.9-.7-8.9-.3-2.5-.6-5.1-2.1-7.3-1.7-2.4-4.9-2.9-7.6-2.5-3.1.5-4.9,2.7-5.2,5.7,0,.6-.1,1.3-.2,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta23 = walletMeta) === null || _walletMeta23 === void 0 ? void 0 : (_walletMeta23$colors = _walletMeta23.colors) === null || _walletMeta23$colors === void 0 ? void 0 : _walletMeta23$colors.secondary) || "#000000",
    d: "M977.9,340.6c-.6,4-.5,8.2-.1,12.1.3,3.6,1,8,4.4,10,2.7,1.5,6.6,1.5,8.7-.9,1-1.1,1.4-2.6,1.6-4.1.2-1.7.3-3.4.4-5.1.2-2.9,0-5.9,0-8.8-.1-2.5-.2-5.1-1.5-7.3-1.5-2.5-4.7-3.3-7.4-3.1-3.2.2-5.1,2.3-5.7,5.3-.1.6-.2,1.3-.3,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta24 = walletMeta) === null || _walletMeta24 === void 0 ? void 0 : (_walletMeta24$colors = _walletMeta24.colors) === null || _walletMeta24$colors === void 0 ? void 0 : _walletMeta24$colors.secondary) || "#000000",
    d: "M979.6,389c-.7,3.9-.8,8.2-.5,12.1.2,3.6.7,8.1,4.1,10.1,2.6,1.6,6.5,1.7,8.7-.7,1-1.1,1.5-2.5,1.8-4,.3-1.7.4-3.4.6-5,.2-2.9.2-5.9.2-8.8,0-2.5,0-5.1-1.3-7.4-1.4-2.6-4.5-3.5-7.3-3.4-3.2,0-5.2,2.1-5.9,5.1-.1.6-.3,1.3-.4,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta25 = walletMeta) === null || _walletMeta25 === void 0 ? void 0 : (_walletMeta25$colors = _walletMeta25.colors) === null || _walletMeta25$colors === void 0 ? void 0 : _walletMeta25$colors.secondary) || "#000000",
    d: "M979.7,437.4c-.8,3.9-1.1,8.2-.9,12.1.1,3.6.5,8.1,3.8,10.3,2.6,1.7,6.5,1.9,8.8-.4,1-1,1.6-2.5,1.9-3.9.3-1.6.5-3.4.7-5,.3-2.9.4-5.8.5-8.8,0-2.5.1-5.1-1-7.4-1.3-2.6-4.4-3.6-7.2-3.6-3.2,0-5.2,1.9-6,4.9-.2.6-.3,1.2-.4,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta26 = walletMeta) === null || _walletMeta26 === void 0 ? void 0 : (_walletMeta26$colors = _walletMeta26.colors) === null || _walletMeta26$colors === void 0 ? void 0 : _walletMeta26$colors.secondary) || "#000000",
    d: "M978.3,485.8c-1,3.9-1.3,8.1-1.3,12,0,3.6.2,8.1,3.4,10.4,2.5,1.8,6.4,2.1,8.8,0,1.1-1,1.7-2.4,2-3.9.4-1.6.6-3.3.9-5,.5-2.9.6-5.8.7-8.7,0-2.5.3-5.1-.8-7.4-1.2-2.6-4.3-3.7-7.1-3.8-3.2-.1-5.3,1.8-6.2,4.7-.2.6-.4,1.2-.5,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta27 = walletMeta) === null || _walletMeta27 === void 0 ? void 0 : (_walletMeta27$colors = _walletMeta27.colors) === null || _walletMeta27$colors === void 0 ? void 0 : _walletMeta27$colors.secondary) || "#000000",
    d: "M975.3,534.1c-1.1,3.9-1.6,8.1-1.7,12,0,3.6,0,8.1,3.1,10.5,2.5,1.8,6.3,2.3,8.8.2,1.1-1,1.8-2.4,2.1-3.8.5-1.6.8-3.3,1-5,.5-2.9.8-5.8,1-8.7.2-2.5.5-5-.5-7.4-1.1-2.7-4.2-3.9-6.9-4.1-3.2-.2-5.4,1.6-6.3,4.5-.2.6-.4,1.2-.6,1.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta28 = walletMeta) === null || _walletMeta28 === void 0 ? void 0 : (_walletMeta28$colors = _walletMeta28.colors) === null || _walletMeta28$colors === void 0 ? void 0 : _walletMeta28$colors.secondary) || "#000000",
    d: "M970.8,582.3c-1.2,3.8-1.8,8-2.1,11.9-.2,3.5-.4,8,2.6,10.5,2.4,2,6.2,2.7,8.7.6,1.2-.9,1.9-2.3,2.3-3.7.5-1.6.9-3.3,1.3-5,.6-2.9,1-5.8,1.3-8.7.3-2.5.6-5-.3-7.5-1.1-2.7-4.1-4-6.8-4.3-3.2-.3-5.4,1.4-6.5,4.3-.2.6-.4,1.2-.6,1.8Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta29 = walletMeta) === null || _walletMeta29 === void 0 ? void 0 : (_walletMeta29$colors = _walletMeta29.colors) === null || _walletMeta29$colors === void 0 ? void 0 : _walletMeta29$colors.secondary) || "#000000",
    d: "M963.5,629.6c-1.6,3.6-2.7,7.5-3.5,11.3-.4,1.7-.8,3.6-.7,5.5,0,1.9.4,3.7,1.7,5.2,2,2.3,5.6,3.7,8.5,2.1,1.3-.7,2.2-2,2.9-3.4.8-1.5,1.4-3.2,2-4.8,1-2.8,1.9-5.7,2.5-8.6.6-2.5,1.2-5,.6-7.6-.8-2.9-3.7-4.4-6.4-4.9-3.1-.6-5.5.9-6.9,3.6-.3.6-.6,1.1-.8,1.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta30 = walletMeta) === null || _walletMeta30 === void 0 ? void 0 : (_walletMeta30$colors = _walletMeta30.colors) === null || _walletMeta30$colors === void 0 ? void 0 : _walletMeta30$colors.secondary) || "#000000",
    d: "M948.3,673.9c-1.1,1.5-2.3,3.1-3.3,4.8-1,1.7-2,3.3-2.9,5-.8,1.5-1.7,3.2-2.2,5-.5,1.7-.6,3.6.2,5.4.6,1.4,1.7,2.7,3,3.6,1.3.9,2.9,1.3,4.5,1,1.5-.3,2.7-1.3,3.8-2.4,1.2-1.3,2.3-2.7,3.3-4.1,1.8-2.5,3.4-5.1,4.8-7.8,1.3-2.3,2.5-4.7,2.5-7.4,0-3-2.5-5.2-5.1-6.3-1.5-.6-2.8-.7-4.1-.4-1.2.4-2.4,1.1-3.4,2.2-.4.5-.8.9-1.2,1.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta31 = walletMeta) === null || _walletMeta31 === void 0 ? void 0 : (_walletMeta31$colors = _walletMeta31.colors) === null || _walletMeta31$colors === void 0 ? void 0 : _walletMeta31$colors.secondary) || "#000000",
    d: "M921,710.8c-1.6,1-3.2,2.1-4.8,3.3-1.5,1.2-3,2.4-4.4,3.7-.6.6-1.3,1.2-1.9,1.9-.7.6-1.3,1.3-1.8,2.1-1.1,1.5-1.8,3.2-1.7,5.2.2,3,2.2,6.4,5.5,6.9,1.5.2,3-.3,4.4-1,.8-.4,1.6-.8,2.3-1.3.8-.5,1.5-1,2.2-1.4,1.3-.8,2.5-1.7,3.8-2.7,1.2-1,2.3-2,3.5-3,1-.9,2-1.8,2.8-2.8.9-1,1.6-2.1,2-3.3.9-2.9-.6-5.8-2.6-7.6-1.2-1.1-2.4-1.6-3.7-1.7-1.3-.1-2.6.3-3.9,1-.5.3-1.1.6-1.6.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta32 = walletMeta) === null || _walletMeta32 === void 0 ? void 0 : (_walletMeta32$colors = _walletMeta32.colors) === null || _walletMeta32$colors === void 0 ? void 0 : _walletMeta32$colors.secondary) || "#000000",
    d: "M882.6,736.6c-3.8.9-7.6,2.4-11,4-.8.4-1.6.8-2.4,1.2-.8.4-1.6.9-2.4,1.5-1.5,1.1-2.7,2.6-3.1,4.5-.6,3,.5,6.7,3.5,8,1.4.6,2.9.5,4.4.3,1.7-.3,3.4-.8,5.1-1.3,1.4-.4,2.9-.9,4.3-1.5,1.4-.5,2.8-1.2,4.2-1.8,1.2-.5,2.4-1,3.5-1.7,1.1-.7,2.1-1.5,2.9-2.6,1.8-2.4,1.2-5.6,0-8-1.5-2.8-4.1-3.8-7.1-3.2-.6.1-1.2.3-1.8.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta33 = walletMeta) === null || _walletMeta33 === void 0 ? void 0 : (_walletMeta33$colors = _walletMeta33.colors) === null || _walletMeta33$colors === void 0 ? void 0 : _walletMeta33$colors.secondary) || "#000000",
    d: "M838.1,752c-2,.1-4,.3-5.9.6-2,.3-3.9.8-5.8,1.3-1.7.4-3.6,1-5.3,1.9-1.7.9-3.1,2.1-3.8,3.9-1.1,2.9-.6,6.7,2.1,8.5,1.2.8,2.8,1,4.3,1,1.7,0,3.4-.2,5.1-.4,3-.3,5.9-.9,8.8-1.6,2.5-.6,5-1.1,7-2.9,2.2-1.9,2.4-5.2,1.6-7.9-.8-3.1-3.2-4.5-6.3-4.6-.6,0-1.3,0-1.9,0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta34 = walletMeta) === null || _walletMeta34 === void 0 ? void 0 : (_walletMeta34$colors = _walletMeta34.colors) === null || _walletMeta34$colors === void 0 ? void 0 : _walletMeta34$colors.secondary) || "#000000",
    d: "M790.9,760.5c-4-.2-8.2.2-12,1-3.5.7-7.9,1.7-9.5,5.3-1.3,2.8-.9,6.7,1.7,8.6,1.2.9,2.7,1.2,4.2,1.3,1.7,0,3.4,0,5.1,0,2.9-.1,5.8-.5,8.7-.9,2.5-.4,5-.6,7.1-2.2,2.4-1.7,2.9-4.9,2.4-7.7-.5-3.1-2.7-4.9-5.8-5.2-.6,0-1.3-.1-1.9-.1Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta35 = walletMeta) === null || _walletMeta35 === void 0 ? void 0 : (_walletMeta35$colors = _walletMeta35.colors) === null || _walletMeta35$colors === void 0 ? void 0 : _walletMeta35$colors.secondary) || "#000000",
    d: "M742.9,766.6c-4-.4-8.2-.1-12.1.5-3.5.5-8,1.4-9.7,4.9-1.4,2.8-1.2,6.6,1.4,8.7,1.2.9,2.7,1.3,4.1,1.4,1.7.1,3.4.1,5.1.1,2.9,0,5.9-.3,8.8-.6,2.5-.3,5.1-.4,7.2-1.9,2.4-1.6,3-4.8,2.7-7.6-.4-3.2-2.5-5-5.6-5.4-.6,0-1.3-.2-1.9-.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta36 = walletMeta) === null || _walletMeta36 === void 0 ? void 0 : (_walletMeta36$colors = _walletMeta36.colors) === null || _walletMeta36$colors === void 0 ? void 0 : _walletMeta36$colors.secondary) || "#000000",
    d: "M694.7,770.8c-4-.5-8.2-.4-12.1,0-3.6.4-8,1.1-9.9,4.6-1.5,2.7-1.4,6.6,1.1,8.7,1.1,1,2.6,1.4,4.1,1.6,1.7.2,3.4.3,5.1.3,2.9,0,5.9,0,8.8-.3,2.5-.2,5.1-.3,7.3-1.6,2.5-1.5,3.2-4.7,3-7.4-.3-3.2-2.4-5.1-5.4-5.6-.6-.1-1.3-.2-1.9-.3Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta37 = walletMeta) === null || _walletMeta37 === void 0 ? void 0 : (_walletMeta37$colors = _walletMeta37.colors) === null || _walletMeta37$colors === void 0 ? void 0 : _walletMeta37$colors.secondary) || "#000000",
    d: "M646.3,773.3c-4-.6-8.2-.7-12.1-.3-3.6.3-8.1.9-10.1,4.3-1.5,2.7-1.6,6.6.8,8.7,1.1,1,2.6,1.5,4,1.7,1.7.3,3.4.4,5.1.5,2.9.2,5.9.1,8.8,0,2.5,0,5.1-.1,7.3-1.4,2.5-1.4,3.4-4.6,3.2-7.3-.2-3.2-2.2-5.1-5.2-5.8-.6-.1-1.3-.3-1.9-.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta38 = walletMeta) === null || _walletMeta38 === void 0 ? void 0 : (_walletMeta38$colors = _walletMeta38.colors) === null || _walletMeta38$colors === void 0 ? void 0 : _walletMeta38$colors.secondary) || "#000000",
    d: "M597.9,774.4c-3.9-.7-8.2-.9-12.1-.6-3.6.2-8.1.7-10.2,4-1.6,2.6-1.8,6.5.6,8.7,1.1,1,2.5,1.5,4,1.8,1.7.3,3.4.4,5,.6,2.9.3,5.8.3,8.8.3,2.5,0,5.1,0,7.4-1.2,2.6-1.4,3.5-4.5,3.5-7.3,0-3.2-2-5.2-5-5.9-.6-.2-1.3-.3-1.9-.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta39 = walletMeta) === null || _walletMeta39 === void 0 ? void 0 : (_walletMeta39$colors = _walletMeta39.colors) === null || _walletMeta39$colors === void 0 ? void 0 : _walletMeta39$colors.secondary) || "#000000",
    d: "M549.6,774.1c-3.9-1-8.1-1.3-12-1.3-3.6,0-8.1.3-10.4,3.5-1.7,2.5-2,6.4.2,8.8,1,1.1,2.5,1.6,3.9,2,1.6.4,3.3.6,5,.8,2.9.4,5.8.6,8.8.7,2.5,0,5.1.3,7.4-.8,2.7-1.3,3.7-4.4,3.7-7.1,0-1.6-.5-2.9-1.3-3.9-.8-1-2-1.7-3.5-2.2-.6-.2-1.2-.4-1.9-.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta40 = walletMeta) === null || _walletMeta40 === void 0 ? void 0 : (_walletMeta40$colors = _walletMeta40.colors) === null || _walletMeta40$colors === void 0 ? void 0 : _walletMeta40$colors.secondary) || "#000000",
    d: "M501.1,771.8c-3.9-1-8.1-1.3-12.1-1.3-3.6,0-8.1.2-10.4,3.5-1.8,2.5-2.1,6.4.1,8.8,1,1.1,2.4,1.7,3.9,2,1.6.4,3.3.6,5,.9,2.9.4,5.8.6,8.7.8,2.5.1,5,.3,7.4-.7,2.6-1.2,3.8-4.3,3.9-7,.1-3.2-1.7-5.3-4.7-6.2-.6-.2-1.2-.4-1.9-.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta41 = walletMeta) === null || _walletMeta41 === void 0 ? void 0 : (_walletMeta41$colors = _walletMeta41.colors) === null || _walletMeta41$colors === void 0 ? void 0 : _walletMeta41$colors.secondary) || "#000000",
    d: "M452.7,769c-3.9-1-8.1-1.5-12-1.6-3.6,0-8.1,0-10.4,3.2-1.8,2.5-2.2,6.3,0,8.8,1,1.1,2.4,1.7,3.8,2.1,1.6.4,3.3.7,5,1,2.9.5,5.8.7,8.7.9,2.5.1,5,.4,7.4-.6,2.7-1.2,3.8-4.2,4-7,.2-3.2-1.6-5.3-4.6-6.3-.6-.2-1.2-.4-1.9-.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta42 = walletMeta) === null || _walletMeta42 === void 0 ? void 0 : (_walletMeta42$colors = _walletMeta42.colors) === null || _walletMeta42$colors === void 0 ? void 0 : _walletMeta42$colors.secondary) || "#000000",
    d: "M404.4,765.1c-3.8-1.1-8-1.8-11.9-1.9-3.6-.1-8.1-.2-10.5,2.9-1.9,2.4-2.5,6.3-.4,8.8,1,1.1,2.4,1.8,3.8,2.2,1.6.5,3.3.8,5,1.1,2.9.6,5.8.9,8.7,1.2,2.5.2,5,.6,7.5-.4,2.7-1.1,4-4.1,4.2-6.9.3-3.2-1.5-5.4-4.4-6.4-.6-.2-1.2-.4-1.8-.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta43 = walletMeta) === null || _walletMeta43 === void 0 ? void 0 : (_walletMeta43$colors = _walletMeta43.colors) === null || _walletMeta43$colors === void 0 ? void 0 : _walletMeta43$colors.secondary) || "#000000",
    d: "M356.3,759.5c-3.8-1.3-7.9-2.1-11.8-2.4-3.6-.3-8.1-.6-10.6,2.4-2,2.3-2.8,6.2-.8,8.7.9,1.2,2.3,1.9,3.7,2.4,1.6.6,3.3,1,4.9,1.4,2.9.7,5.8,1.1,8.7,1.5,2.5.3,5,.8,7.5,0,2.7-1,4.1-4,4.5-6.7.4-3.2-1.3-5.4-4.1-6.6-.6-.2-1.2-.5-1.8-.7Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta44 = walletMeta) === null || _walletMeta44 === void 0 ? void 0 : (_walletMeta44$colors = _walletMeta44.colors) === null || _walletMeta44$colors === void 0 ? void 0 : _walletMeta44$colors.secondary) || "#000000",
    d: "M308.8,751.7c-3.7-1.5-7.7-2.5-11.6-3-1.8-.2-3.7-.5-5.7-.3-1.9.2-3.7.6-5.1,2-2.2,2.1-3.3,5.9-1.5,8.6.8,1.2,2.1,2.2,3.5,2.7,1.6.6,3.2,1.1,4.9,1.6,2.8.9,5.7,1.5,8.6,2,2.5.5,5,1.1,7.5.4,2.8-.8,4.3-3.7,4.8-6.4.5-3.1-1-5.5-3.7-6.8-.6-.3-1.2-.5-1.8-.8Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta45 = walletMeta) === null || _walletMeta45 === void 0 ? void 0 : (_walletMeta45$colors = _walletMeta45.colors) === null || _walletMeta45$colors === void 0 ? void 0 : _walletMeta45$colors.secondary) || "#000000",
    d: "M261.9,740.7c-3.6-1.8-7.6-3-11.4-3.8-3.5-.8-7.9-1.6-10.8,1.1-2.3,2.1-3.5,5.7-1.9,8.6.7,1.3,2,2.2,3.4,2.8,1.5.7,3.1,1.4,4.7,2,2.7,1.1,5.6,1.9,8.4,2.6,2.4.6,4.9,1.4,7.4.8,2.8-.6,4.6-3.4,5.2-6.1.8-3.1-.6-5.6-3.3-7-.6-.3-1.1-.6-1.7-.9Z"
  })), /*#__PURE__*/React.createElement("g", {
    opacity: "0.3"
  }, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta46 = walletMeta) === null || _walletMeta46 === void 0 ? void 0 : (_walletMeta46$colors = _walletMeta46.colors) === null || _walletMeta46$colors === void 0 ? void 0 : _walletMeta46$colors.secondary) || "#ffffff",
    d: "M206.3,218.7c-21,19.1-30.7,59.5-20.1,88.1,2.1,5.7,5,11,8.9,15.5,4.4,4.3,9.5,8.8,15.8,8.2,41.6-1.4,50.6-60.8,45.7-92.5-2.5-16.3-15-34.2-33.5-27.9-6.1,1.3-11.9,4.3-16.7,8.6Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta47 = walletMeta) === null || _walletMeta47 === void 0 ? void 0 : (_walletMeta47$colors = _walletMeta47.colors) === null || _walletMeta47$colors === void 0 ? void 0 : _walletMeta47$colors.secondary) || "#ffffff",
    d: "M192.7,367.3c-8.3,9.1-11.8,21.8-9.7,34.1,3.1,15.7,15.8,36.8,33.2,30.4,19.9-7.6,24.5-34.2,19.3-53.9-2.4-9-8.5-16.8-17.6-20-9.4-3-18.6,1.9-25.2,9.4Z"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta48 = walletMeta) === null || _walletMeta48 === void 0 ? void 0 : (_walletMeta48$colors = _walletMeta48.colors) === null || _walletMeta48$colors === void 0 ? void 0 : _walletMeta48$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta49 = walletMeta) === null || _walletMeta49 === void 0 ? void 0 : (_walletMeta49$colors = _walletMeta49.colors) === null || _walletMeta49$colors === void 0 ? void 0 : _walletMeta49$colors.secondary) || "#000000"
    },
    d: "M949.3,571.5c-1.3,9.7-3.1,19.1-5.7,28.4v-.4c-3.8,12.7-8.5,25.4-15.8,36.4l.5-.3c-12.1,19.2-29.3,34.8-49.8,44.9-2.6,1.3-5.2,2.6-7.8,3.8-1.4.6-2.8,1.3-4.2,1.9-.7.3-1.3.6-2,.8-.7.3.2,0,.3-.1-.5.2-1,.4-1.5.6-3.1,1.2-5.7,4.2-4.6,7.8.9,3,4.4,5.9,7.8,4.6,10.5-4.1,20.6-9.1,30.1-15,38.7-22.6,59-66.8,63.7-110,.1-3.6-1.3-7.8-5.7-8.1-2.8,0-5.1,2.1-5.3,4.7h0Z"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta50 = walletMeta) === null || _walletMeta50 === void 0 ? void 0 : (_walletMeta50$colors = _walletMeta50.colors) === null || _walletMeta50$colors === void 0 ? void 0 : _walletMeta50$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta51 = walletMeta) === null || _walletMeta51 === void 0 ? void 0 : (_walletMeta51$colors = _walletMeta51.colors) === null || _walletMeta51$colors === void 0 ? void 0 : _walletMeta51$colors.secondary) || "#000000"
    },
    d: "M858,692.8c.5,1.6.9,3.3,1,4.9.1,1.6,0,3.2-.2,4.8-1.8,8.8-7,17.5-16.4,20.7-1.4.5-2.9.8-4.4,1-9.3,2-19-3.9-21-12.7-3-13.9,12.3-23.4,25.5-22.7,2.2,0,4.4.2,6.5.7,2,.4,3.9,1.1,5.8,2,.9.4,2,.9,3.1,1.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta52 = walletMeta) === null || _walletMeta52 === void 0 ? void 0 : (_walletMeta52$colors = _walletMeta52.colors) === null || _walletMeta52$colors === void 0 ? void 0 : _walletMeta52$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta53 = walletMeta) === null || _walletMeta53 === void 0 ? void 0 : (_walletMeta53$colors = _walletMeta53.colors) === null || _walletMeta53$colors === void 0 ? void 0 : _walletMeta53$colors.secondary) || "#000000"
    },
    d: "M852.4,694.2c.4,1.2.7,2.4.9,3.7-.1-1.1,0,.9,0,.9,0,.6,0,1.2,0,1.8,0,.2-.3,2,0,.7,0,.5-.2.9-.3,1.3-.2.9-.5,1.8-.8,2.7-.2.4-.3.9-.5,1.3,0,.2-.7,1.6-.1.3-.4.8-.8,1.7-1.3,2.5-.4.7-.8,1.3-1.2,2-.3.4-.5.8-.8,1.1.9-1.1-.4.4-.6.6-.6.7-1.3,1.3-2,1.9-.2.2-.5.4-.7.6,1.1-.8-.2,0-.4.2-.8.5-1.7,1-2.5,1.4-.2,0-1.7.6-.4.2-.7.2-1.4.5-2.1.6-.9.2-1.8.4-2.7.6-.5,0-.9.2-1.4.2,1.5-.2,0,0-.3,0-.9,0-1.8,0-2.8-.1,1.5.2,0,0-.3,0-.4-.1-.9-.2-1.3-.4-.4-.1-.9-.3-1.3-.5-1.4-.5,1,.6-.3-.1-.8-.5-1.5-.9-2.3-1.4-1.2-.8.8.8-.2-.2-.3-.3-.5-.5-.8-.8-.3-.3-.5-.5-.8-.8-.2-.2-.4-.4-.6-.7.4.6.5.6,0,.1-.5-.8-.9-1.5-1.3-2.3-.6-1.3.3,1.1,0-.3,0-.4-.2-.7-.3-1.1,0-.4-.1-.7-.2-1.1-.3-1.4,0,1.2,0-.2,0-.6-.3-2.4.1-2.9,0,.2,0,.5-.1.7,0-.3.1-.5.2-.8,0-.4.2-.8.3-1.1,0-.2.2-.5.3-.7.4-1.3-.6,1.1,0,0,.4-.7.8-1.4,1.2-2,.2-.3.7-1.4,0-.1.2-.4.7-.9,1.1-1.2.5-.5,1-1,1.5-1.4.3-.3.6-.5,1-.8-1.2.9,0,0,.2,0,1.4-.9,3-1.7,4.5-2.4-1.4.6,0,0,.2,0,.5-.2,1.1-.4,1.7-.5,1-.3,2-.5,3-.7.3,0,.6-.1.9-.1.3,0,.6,0,.9-.1-.8,0-.9.1-.2,0,1,0,2,0,3,0,1.3,0,2.7,0,4,.2.2,0,1.1.2.2,0,.8.1,1.6.3,2.3.5,3.1.8,4.6,1.7,7.7,3.1,2.8,1.2,6.5-1.1,7.2-3.9.8-3.3-.9-5.9-3.9-7.2-.3-.1-.6-.2-.9-.4-.9-.4.6.3-.2,0-.7-.3-1.3-.6-2-.9-1.5-.7-3.1-1.3-4.7-1.7-3-.8-6.1-1.2-9.2-1.2-4.3,0-8.7.5-12.8,1.9-8.3,3-16.5,9.1-18.4,18.2-2.1,9.9,2.8,20.1,11.9,24.5,9.8,4.8,21.7,2.6,30-4.2,9-7.3,13.8-21,10.2-32.1-.9-2.9-3.9-5.1-7-4.2-2.8.9-5.1,3.9-4.2,7Z"
  })), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta54 = walletMeta) === null || _walletMeta54 === void 0 ? void 0 : (_walletMeta54$colors = _walletMeta54.colors) === null || _walletMeta54$colors === void 0 ? void 0 : _walletMeta54$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta55 = walletMeta) === null || _walletMeta55 === void 0 ? void 0 : (_walletMeta55$colors = _walletMeta55.colors) === null || _walletMeta55$colors === void 0 ? void 0 : _walletMeta55$colors.secondary) || "#000000"
    },
    d: "M840.9,682.9c-.9-.2-1.9-.3-2.8-.5-.3,0-.5-.1-.8-.2.2,0,.3.1.5.2.2.3,1.3,1.6,1.1,1.8,0-.2-.1-.4-.1-.5,0-.3,0-.2,0,.2,0,.5,0,.5,0,.2,0-.2,0-.4,0-.6,0-1,0,.4,0,.4,0-.1,0-.2,0-.4.2-.5.2-.5,0,0-.2.4-.2.5,0,.2,0-.2.2-.3.3-.5.1.2-1,1-1.1,1.1.9-.5-.9.5-.3.1.3-.2-.6,0,0,0,.4,0,.9,0,1.3,0,.5,0,.6,0,0,0,.9.1,1.7.4,2.5.7.4.1.6.2,0,0,.4.2.8.4,1.2.6.7.4,1.4.8,2,1.3.3.2.6.4.9.6-.8-.6.2.1.3.3.6.5,1.2,1.1,1.7,1.6,2.6,2.5,5.1,5.2,7.3,8.1,2.8-2.7,5.5-5.3,8.3-8-2.9-3.8-7.7-6.3-12.5-6.9-2.2-.3-4.4-.5-6.6-.6-.9,0-1.8,0-2.7,0-1.8,0-3.3.6-4.9,1.3-2.7,1.2-3.8,5.3-2.2,7.8,1.7,2.8,4.9,3.6,7.8,2.2,1.3-.6-.9.2-.9.1,0,0,1,0,1.1,0,.8,0,1.7,0,2.5,0,1.7,0,3.5.3,5.2.5-.6,0-.1,0,.2,0,.4.1.7.2,1.1.3.4.1.7.2.1,0,.3.1.6.3.9.5.3.2.6.4.9.5,1.2.8-.2-.4.3.2.5.6,1.1,1.1,1.6,1.8,1.8,2.4,6.2,2.2,8.1.2,2.4-2.5,2.1-5.6.2-8.1-2.8-3.8-6.2-7.4-9.8-10.4-4.2-3.5-9.2-6.2-14.8-6.2-2.9,0-5.7.5-7.9,2.5-2,1.9-2.9,4.4-3.3,7.1-.3,2.6.3,5.8,2.1,7.8,2.2,2.4,5,3.1,8.1,3.7,3,.5,6.4-.6,7.2-3.9.7-2.8-.7-6.6-3.9-7.2Z"
  }))), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta56 = walletMeta) === null || _walletMeta56 === void 0 ? void 0 : (_walletMeta56$colors = _walletMeta56.colors) === null || _walletMeta56$colors === void 0 ? void 0 : _walletMeta56$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta57 = walletMeta) === null || _walletMeta57 === void 0 ? void 0 : (_walletMeta57$colors = _walletMeta57.colors) === null || _walletMeta57$colors === void 0 ? void 0 : _walletMeta57$colors.secondary) || "#000000"
    },
    d: "M173.8,571.5c1.3,9.7,3.1,19.1,5.7,28.4v-.4c3.8,12.7,8.5,25.4,15.8,36.4l-.5-.3c12.1,19.2,29.3,34.8,49.8,44.9,2.6,1.3,5.2,2.6,7.8,3.8,1.4.6,2.8,1.3,4.2,1.9.7.3,1.3.6,2,.8.7.3-.2,0-.3-.1.5.2,1,.4,1.5.6,3.1,1.2,5.7,4.2,4.6,7.8-.9,3-4.4,5.9-7.8,4.6-10.5-4.1-20.6-9.1-30.1-15-38.7-22.6-59-66.8-63.7-110-.1-3.6,1.3-7.8,5.7-8.1,2.8,0,5.1,2.1,5.3,4.7h0Z"
  }), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta58 = walletMeta) === null || _walletMeta58 === void 0 ? void 0 : (_walletMeta58$colors = _walletMeta58.colors) === null || _walletMeta58$colors === void 0 ? void 0 : _walletMeta58$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta59 = walletMeta) === null || _walletMeta59 === void 0 ? void 0 : (_walletMeta59$colors = _walletMeta59.colors) === null || _walletMeta59$colors === void 0 ? void 0 : _walletMeta59$colors.secondary) || "#000000"
    },
    d: "M265.2,692.8c-.5,1.6-.9,3.3-1,4.9-.1,1.6,0,3.2.2,4.8,1.8,8.8,7,17.5,16.4,20.7,1.4.5,2.9.8,4.4,1,9.3,2,19-3.9,21-12.7,3-13.9-12.3-23.4-25.5-22.7-2.2,0-4.4.2-6.5.7-2,.4-3.9,1.1-5.8,2-.9.4-2,.9-3.1,1.4Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta60 = walletMeta) === null || _walletMeta60 === void 0 ? void 0 : (_walletMeta60$colors = _walletMeta60.colors) === null || _walletMeta60$colors === void 0 ? void 0 : _walletMeta60$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta61 = walletMeta) === null || _walletMeta61 === void 0 ? void 0 : (_walletMeta61$colors = _walletMeta61.colors) === null || _walletMeta61$colors === void 0 ? void 0 : _walletMeta61$colors.secondary) || "#000000"
    },
    d: "M270.8,694.2c-.4,1.2-.7,2.4-.9,3.7.1-1.1,0,.9,0,.9,0,.6,0,1.2,0,1.8,0,.2.3,2,0,.7,0,.5.2.9.3,1.3.2.9.5,1.8.8,2.7.2.4.3.9.5,1.3,0,.2.7,1.6.1.3.4.8.8,1.7,1.3,2.5.4.7.8,1.3,1.2,2,.3.4.5.8.8,1.1-.9-1.1.4.4.6.6.6.7,1.3,1.3,2,1.9.2.2.5.4.7.6-1.1-.8.2,0,.4.2.8.5,1.7,1,2.5,1.4.2,0,1.7.6.4.2.7.2,1.4.5,2.1.6.9.2,1.8.4,2.7.6.5,0,.9.2,1.4.2-1.5-.2,0,0,.3,0,.9,0,1.8,0,2.8-.1-1.5.2,0,0,.3,0,.4-.1.9-.2,1.3-.4.4-.1.9-.3,1.3-.5,1.4-.5-1,.6.3-.1.8-.5,1.5-.9,2.3-1.4,1.2-.8-.8.8.2-.2.3-.3.5-.5.8-.8.3-.3.5-.5.8-.8.2-.2.4-.4.6-.7-.4.6-.5.6,0,.1.5-.8.9-1.5,1.3-2.3.6-1.3-.3,1.1,0-.3,0-.4.2-.7.3-1.1,0-.4.1-.7.2-1.1.3-1.4,0,1.2,0-.2,0-.6.3-2.4-.1-2.9,0,.2,0,.5.1.7,0-.3-.1-.5-.2-.8,0-.4-.2-.8-.3-1.1,0-.2-.2-.5-.3-.7-.4-1.3.6,1.1,0,0-.4-.7-.8-1.4-1.2-2-.2-.3-.7-1.4,0-.1-.2-.4-.7-.9-1.1-1.2-.5-.5-1-1-1.5-1.4-.3-.3-.6-.5-1-.8,1.2.9,0,0-.2,0-1.4-.9-3-1.7-4.5-2.4,1.4.6,0,0-.2,0-.5-.2-1.1-.4-1.7-.5-1-.3-2-.5-3-.7-.3,0-.6-.1-.9-.1-.3,0-.6,0-.9-.1.8,0,.9.1.2,0-1,0-2,0-3,0-1.3,0-2.7,0-4,.2-.2,0-1.1.2-.2,0-.8.1-1.6.3-2.3.5-3.1.8-4.6,1.7-7.7,3.1-2.8,1.2-6.5-1.1-7.2-3.9-.8-3.3.9-5.9,3.9-7.2.3-.1.6-.2.9-.4.9-.4-.6.3.2,0,.7-.3,1.3-.6,2-.9,1.5-.7,3.1-1.3,4.7-1.7,3-.8,6.1-1.2,9.2-1.2,4.3,0,8.7.5,12.8,1.9,8.3,3,16.5,9.1,18.4,18.2,2.1,9.9-2.8,20.1-11.9,24.5-9.8,4.8-21.7,2.6-30-4.2-9-7.3-13.8-21-10.2-32.1.9-2.9,3.9-5.1,7-4.2,2.8.9,5.1,3.9,4.2,7Z"
  })), /*#__PURE__*/React.createElement("path", {
    fill: ((_walletMeta62 = walletMeta) === null || _walletMeta62 === void 0 ? void 0 : (_walletMeta62$colors = _walletMeta62.colors) === null || _walletMeta62$colors === void 0 ? void 0 : _walletMeta62$colors.secondary) || "#000000",
    style: {
      fill: ((_walletMeta63 = walletMeta) === null || _walletMeta63 === void 0 ? void 0 : (_walletMeta63$colors = _walletMeta63.colors) === null || _walletMeta63$colors === void 0 ? void 0 : _walletMeta63$colors.secondary) || "#000000"
    },
    d: "M282.2,682.9c.9-.2,1.9-.3,2.8-.5.3,0,.5-.1.8-.2-.2,0-.3.1-.5.2-.2.3-1.3,1.6-1.1,1.8,0-.2.1-.4.1-.5,0-.3,0-.2,0,.2,0,.5,0,.5,0,.2,0-.2,0-.4,0-.6,0-1,0,.4,0,.4,0-.1,0-.2,0-.4-.2-.5-.2-.5,0,0,.2.4.2.5,0,.2,0-.2-.2-.3-.3-.5-.1.2,1,1,1.1,1.1-.9-.5.9.5.3.1-.3-.2.6,0,0,0-.4,0-.9,0-1.3,0-.5,0-.6,0,0,0-.9.1-1.7.4-2.5.7-.4.1-.6.2,0,0-.4.2-.8.4-1.2.6-.7.4-1.4.8-2,1.3-.3.2-.6.4-.9.6.8-.6-.2.1-.3.3-.6.5-1.2,1.1-1.7,1.6-2.6,2.5-5.1,5.2-7.3,8.1-2.8-2.7-5.5-5.3-8.3-8,2.9-3.8,7.7-6.3,12.5-6.9,2.2-.3,4.4-.5,6.6-.6.9,0,1.8,0,2.7,0,1.8,0,3.3.6,4.9,1.3,2.7,1.2,3.8,5.3,2.2,7.8-1.7,2.8-4.9,3.6-7.8,2.2-1.3-.6.9.2.9.1,0,0-1,0-1.1,0-.8,0-1.7,0-2.5,0-1.7,0-3.5.3-5.2.5.6,0,.1,0-.2,0-.4.1-.7.2-1.1.3-.4.1-.7.2-.1,0-.3.1-.6.3-.9.5-.3.2-.6.4-.9.5-1.2.8.2-.4-.3.2-.5.6-1.1,1.1-1.6,1.8-1.8,2.4-6.2,2.2-8.1.2-2.4-2.5-2.1-5.6-.2-8.1,2.8-3.8,6.2-7.4,9.8-10.4,4.2-3.5,9.2-6.2,14.8-6.2,2.9,0,5.7.5,7.9,2.5,2,1.9,2.9,4.4,3.3,7.1.3,2.6-.3,5.8-2.1,7.8-2.2,2.4-5,3.1-8.1,3.7-3,.5-6.4-.6-7.2-3.9-.7-2.8.7-6.6,3.9-7.2Z"
  }))), ((_walletMeta64 = walletMeta) === null || _walletMeta64 === void 0 ? void 0 : _walletMeta64.logo) && /*#__PURE__*/React.createElement(React.Fragment, null, ((_walletMeta65 = walletMeta) === null || _walletMeta65 === void 0 ? void 0 : (_walletMeta65$colors = _walletMeta65.colors) === null || _walletMeta65$colors === void 0 ? void 0 : _walletMeta65$colors.background) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "clipLogo"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "340",
    height: "340",
    rx: "80",
    ry: "80"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "420",
    y: "290",
    width: "340",
    height: "340",
    rx: "80",
    fill: (_walletMeta66 = walletMeta) === null || _walletMeta66 === void 0 ? void 0 : (_walletMeta66$colors = _walletMeta66.colors) === null || _walletMeta66$colors === void 0 ? void 0 : _walletMeta66$colors.background
  })), /*#__PURE__*/React.createElement("image", {
    x: "420",
    y: "290",
    width: "340",
    height: "340",
    href: walletMeta.logo,
    clipPath: "inset(0 round 60px)",
    preserveAspectRatio: "xMidYMid meet"
  })), !((_walletMeta67 = walletMeta) !== null && _walletMeta67 !== void 0 && _walletMeta67.logo) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("g", {
    opacity: "0.3"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    d: "M453.7,592.4c0,0-.1,0-.2,0,0,0-.1,0-.2,0-11,1.7-25.6,8.1-28.8,20.6-3.3,12.8,9.2,21.9,19.5,24.7,10.7,2.9,22.5,1.3,32.4-3.8,9.1-4.6,17.6-14.3,12.4-25.4-6.2-13.3-22.1-17.9-35.1-16.2Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#ffffff",
    d: "M721,592.5c0,0-.1,0-.2,0,0,0-.1,0-.2,0-12.2-1.5-25.2,2-33,12.6-3.1,4.3-4.8,9.7-3.1,15,1.6,5.1,5.5,9,9.7,11.8,9.2,6.1,21,8.4,31.7,6.8,10.2-1.5,24-8.5,24.4-21,.4-15.1-17.5-23.4-29.3-25.2Z"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M626.4,611.1c-4.5-14.6-16.7-26.3-33.5-27.3-18.7-1.2-31.9,11.3-37.9,26.9-3.4,8.8,11.4,13.1,14.8,4.3,3.6-9.4,11.1-17.7,22.7-16.7,9.7.9,16.3,7.7,18.9,16.2,2.8,9,17.8,5.6,15-3.4h0Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M705.6,545.8s0,0,.1-.1c8.3-8.4,19.1-14.9,30.8-20.1,4.5-2,2.4-8.5-2.5-7.8-22,2.9-42.1,16.6-57.3,30.8-3,2.6-5.8,5.3-8.5,8.1-2.5,2.6-5,5.3-7.3,8.1-2.5,3.1.4,7.4,4.5,6.6.2,0,.4,0,.5-.1,4.2-.8,8.4-1.4,12.7-1.7,20.3-1.8,40.5,2,59.6,7.6,4.5,1.3,7.7-4,4.3-7-9.8-8.4-22-14.6-34.8-17.6-3.3-.8-4.4-4.7-1.9-6.9Z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#000000",
    d: "M465,545.8s0,0-.1-.1c-8.3-8.4-19.1-14.9-30.8-20.1-4.5-2-2.4-8.5,2.5-7.8,22,2.9,42.1,16.6,57.3,30.8,3,2.6,5.8,5.3,8.5,8.1,2.5,2.6,5,5.3,7.3,8.1,2.5,3.1-.4,7.4-4.5,6.6-.2,0-.4,0-.5-.1-4.2-.8-8.4-1.4-12.7-1.7-20.3-1.8-40.5,2-59.6,7.6-4.5,1.3-7.7-4-4.3-7,9.8-8.4,22-14.6,34.8-17.6,3.3-.8,4.4-4.7,1.9-6.9Z"
  }))));
});

function ReactDialogStyle (styles) {
  let background =
    typeof styles === 'object' && styles.background ? styles.background : 'rgba(0,0,0,0.4)';

  return `
    .ReactDialog {
      bottom: 0;
      display: flex;
      height: 100%;
      height: 100vh;
      left: 0;
      min-height: 100%;
      min-height: 100vh;
      overflow: hidden;
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      width: 100vw;
    }

    .ReactDialogInner {
      align-items: center;
      display: flex;
      flex: 1;
      justify-content: center;
    }

    .ReactDialogBackground {
      background: ${background};
      bottom: 0;
      display: block;
      height: 100%;
      left: 0;
      opacity: 0;
      position: fixed;
      right: 0;
      top: 0;
      transition: opacity 0.4s ease;
      width: 100%;
    }

    .ReactDialog.ReactDialogOpen .ReactDialogBackground {
      opacity: 1;
    }

    .ReactDialogAnimation {
      display: inline-block;
      position: relative;
      opacity: 0;
      top: -17vh;
      transition: opacity 0.4s ease, top 0.4s ease;
    }

    .ReactDialog.ReactDialogOpen .ReactDialogAnimation {
      opacity: 1.0;
      top: -5vh;
    }
  `
}

const _jsxFileName$1 = "/Users/sebastian/Work/DePay/react-dialog/src/components/Dialog.jsx";
class Dialog extends React.Component {
  constructor(props) {
    super(props);

    this.handler = this.onKeyDown.bind(this);

    this.state = {
      open: true,
    };
  }

  closeDialog() {
    this.props.close();
  }

  onKeyDown(event) {
    if (event.key === 'Escape') {
      this.closeDialog();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.open === false && prevProps.open === true) {
      this.setState({ open: false });
    }
  }

  onClickBackground(event) {
    this.closeDialog();
  }

  componentDidMount() {
    if(this.props.animate === false) {
      this.setState({ open: true });
    } else {
      // make sure state is false first before opening the dialog
      // to ensure opening is animated
      this.setState({ open: false }, () => {
        setTimeout(() => {
          this.setState({ open: true });
        }, 10);
      });
    }
    this.props.document.addEventListener('keydown', this.handler, true);
  }

  componentWillUnmount() {
    this.props.document.removeEventListener('keydown', this.handler, true);
  }

  render() {
    const classNames = ['ReactDialog', this.state.open ? 'ReactDialogOpen' : ''];
    const style = ReactDialogStyle({ background: this.props.background });
    return (
      React.createElement('div', { key: this.props.dialogKey, className: classNames.join(' '), __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 59}}
        , React.createElement('style', {__self: this, __source: {fileName: _jsxFileName$1, lineNumber: 60}}, style)
        , React.createElement('div', { className: "ReactDialogInner", __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 61}}
          , React.createElement('div', { className: "ReactDialogBackground", onClick: this.onClickBackground.bind(this), __self: this, __source: {fileName: _jsxFileName$1, lineNumber: 62}} )
          , this.props.children
        )
      )
    )
  }
}

const _jsxFileName = "/Users/sebastian/Work/DePay/react-dialog/src/index.jsx";
class ReactDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.open === false && prevProps.open === true) {
      setTimeout(() => {
        this.setState({ open: false });
      }, 400);
    } else if (this.props.open === true && prevProps.open === false) {
      this.setState({ open: true });
    }
  }

  render() {
    let _document = this.props.document || document;
    let container = this.props.container || _document.body;
    if (this.state.open) {
      return ReactDOM.createPortal(
        React.createElement(Dialog, {
          background: this.props.background,
          close: this.props.close,
          document: _document,
          open: this.props.open,
          animate: this.props.animate, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
        
          , this.props.children
        ),
        container,
      )
    } else {
      // enforces unmount
      return null
    }
  }
}

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary(props) {
    _classCallCheck(this, ErrorBoundary);

    return _super.call(this, props);
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      if (error.error) {
        error = error.error;
      }

      this.props.setError(error);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return ErrorBoundary;
}(React.Component);

var ErrorProvider = (function (props) {
  var _useState = useState(props.error),
      _useState2 = _slicedToArray(_useState, 2),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = useState(true),
      _useState4 = _slicedToArray(_useState3, 2),
      open = _useState4[0],
      setOpen = _useState4[1];

  useEffect(function () {
    window._depayWidgetError = undefined;
  }, []);

  var setErrorFromChildren = function setErrorFromChildren(error) {
    window._depayWidgetError = error;

    if (error.error) {
      error = error.error;
    }

    setError(error);

    if (props.errorCallback) {
      props.errorCallback(error.message || error.toString());
    }
  };

  var close = function close() {
    setOpen(false);
    setTimeout(props.unmount, 300);
  };

  if (error) {
    return /*#__PURE__*/React.createElement(ReactDialog, {
      container: props.container,
      close: close,
      open: open
    }, /*#__PURE__*/React.createElement("div", {
      className: "Dialog ReactDialogAnimation"
    }, /*#__PURE__*/React.createElement("div", {
      className: "DialogHeader"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://support.depay.com?query=".concat(encodeURIComponent("DePay Widget Error: ".concat(error.message || error.toString()))),
      target: "_blank",
      className: "Card secondary small inlineBlock"
    }, "Contact support"))), /*#__PURE__*/React.createElement("div", {
      className: "DialogBody TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper PaddingTopS"
    }, /*#__PURE__*/React.createElement(ErrorGraphic, null)), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Oops, Something Went Wrong"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("pre", {
      className: "ErrorSnippetText"
    }, error.message || error.toString())), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM PaddingTopS"
    }, "If this keeps happening, please report it.")))), /*#__PURE__*/React.createElement("div", {
      className: "DialogFooter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: close
    }, "Try again")))));
  } else {
    return /*#__PURE__*/React.createElement(ErrorContext.Provider, {
      value: {
        setError: setErrorFromChildren,
        errorCallback: props.errorCallback,
        error: error
      }
    }, /*#__PURE__*/React.createElement(ErrorBoundary, {
      setError: setErrorFromChildren
    }, props.children));
  }
});

var ActionIndicatorStyle = (function (style) {
  return "\n\n    .ActionIndicator {\n      height: 64px;\n      width: 64px;\n      text-align: center;\n      margin: 0 auto;\n    }\n\n    .ActionIndicator img {\n      height: 41px;\n      width: 41px;\n      position: absolute;\n      margin: 11px;\n    }\n\n    .ActionIndicatorSpinner {\n      position: absolute;\n      top: 0;\n      right: 0;\n      bottom: 0;\n      left: 0;\n    }\n\n    .ActionIndicatorSpinner {\n      height: 64px;\n      width: 64px;\n      border: 4px solid ".concat(style.colors.background, ";\n      border: 4px solid color-mix(in srgb, ").concat(style.colors.background, " 90%, ").concat(style.colors.mixActive, " 10%);\n      border-bottom-color: ").concat(style.colors.primary, ";\n      border-radius: 50%;\n      display: inline-block;\n      position: relative;\n      margin: 0 auto;\n      box-sizing: border-box;\n      animation: ActionIndicatorSpinnerRotation 1s linear infinite;\n    }\n\n    @keyframes ActionIndicatorSpinnerRotation {\n      0% { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    } \n  ");
});

var AlertStyle = (function (style) {
  return "\n\n    .Alert {\n      background: ".concat(style.colors.warning, ";\n      background: color-mix(in srgb, ").concat(style.colors.warning, " 20%, ").concat(style.colors.background, " 80%);\n      border: 1px solid ").concat(style.colors.warning, ";\n      border-radius: 7px;\n      font-weight: 500;\n      padding: 8px;\n    }\n\n    .Alert, .Alert * {\n      color: ").concat(style.colors.text, ";\n    }\n  ");
});

var InfoStyle = (function (style) {
  return "\n\n    .Info {\n      background: ".concat(style.colors.cardBackground, ";\n      background: color-mix(in srgb, ").concat(style.colors.cardBackground, " 90%, ").concat(style.colors.mixActive, " 10%);\n      border: 1px ").concat(style.colors.mixActive, ";\n      border: 1px solid color-mix(in srgb, ").concat(style.colors.cardBackground, " 70%, ").concat(style.colors.mixActive, " 30%);\n      border-radius: 7px;\n      font-weight: 500;\n      padding: 8px;\n    }\n  ");
});

var ButtonCircularStyle = (function (style) {
  return "\n\n    .ButtonCircular {\n      border-radius: 9999px;\n      border: 1px solid transparent;\n      cursor: pointer;\n      height: 34px;\n      opacity: 0.5;\n      padding: 5px 4px 4px 4px;\n      width: 34px;\n    }\n\n    .ButtonCircular:focus {\n      border: 1px solid ".concat(style.colors.primary, ";\n    }\n\n    .ButtonCircular:hover {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 90%, ").concat(style.colors.mixActive, " 10%);\n      opacity: 1;\n    }\n\n    .ButtonCircular:active {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 85%, ").concat(style.colors.mixActive, " 15%);\n      opacity: 1;\n    }\n  ");
});

var ButtonPrimaryStyle = (function (style) {
  return "\n\n    .ButtonPrimary {\n      align-items: center;\n      align-self: center;\n      background: ".concat(style.colors.primary, ";\n      border-radius: 13px;\n      border: 1px solid transparent;\n      box-shadow: 0 0 16px rgba(0,0,0,0.1);\n      font-size: 22px;\n      font-weight: 400;\n      line-height: 40px;\n      height: 58px;\n      justify-content: center;\n      width: 100%;\n      overflow: hidden;\n      padding: 7px 0;\n      position: relative;\n      text-align: center;\n      text-decoration: none;\n      text-overflow: ellipsis;\n      transition: background 0.1s;\n      vertical-align: middle;\n      display: inline-block;\n    }\n\n    .ButtonPrimary, .ButtonPrimary * {\n      color: ").concat(style.colors.buttonText, ";\n    }\n\n    .ButtonPrimary.disabled {\n      background-color: ").concat(style.colors.background, " !important;\n      background-color: color-mix(in srgb, ").concat(style.colors.background, " 75%, ").concat(style.colors.mixActive, " 15%) !important;\n      color: ").concat(style.colors.buttonText, " !important;\n      color: color-mix(in srgb, ").concat(style.colors.buttonText, " 70%, ").concat(style.colors.mixActive, " 30%) !important;\n      box-shadow: 0 !important;\n    }\n    \n    .ButtonPrimary.disabled * {\n      opacity: 0.7;\n    }\n\n    .ButtonPrimary:not(.disabled){\n      cursor: pointer;\n    }\n    .ButtonPrimary:not(.disabled):hover {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.1);\n    }\n    .ButtonPrimary:not(.disabled):active {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);\n    }\n  ");
});

var CardStyle = (function (style) {
  return "\n\n    .Card {\n      align-items: center;\n      background: ".concat(style.colors.cardBackground, ";\n      border: 1px solid transparent;\n      border-radius: 13px;\n      box-shadow: 0 0 8px rgba(0,0,0,0.03);\n      cursor: pointer;\n      display: flex;\n      flex-direction: row;\n      margin-bottom: 8px;\n      min-height: 74px;\n      padding: 14px 8px;\n      width: 100%;\n    }\n\n    .Card.transparent {\n      background: none;\n    }\n\n    .Card:focus:not(.disabled) {\n      border: 1px solid ").concat(style.colors.primary, ";\n    }\n\n    .Card.center {\n      justify-content: center;\n    }\n\n    .Card.Row {\n      border-radius: 0;\n      margin-bottom: 0;\n      box-shadow: none;\n      min-height: 69px;\n      padding: 7px 21px;\n      border-top: 1px solid rgba(0,0,0,0.05);\n    }\n\n    .Card.Row .CardText {\n      font-size: 19px;\n      line-height: 40px;\n    }\n\n    .CardTokenSymbol {\n      width: 40%;\n      min-width: 0;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .CardTokenFullName {\n      width: 100%;\n      min-width: 0;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .CardTokenName {\n      text-align: right;\n      opacity: 0.5;\n      width: 60%;\n      min-width: 0;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n    \n    .Card.Row .CardTokenName .CardText {\n      font-size: 17px;\n    }\n\n    .Card.Row .CardImage {\n      width: 40px;\n    }\n\n    .Card.Row .CardImage img {\n      height: 30px;\n      width: 30px;\n    }\n\n    a.Card, a.Card * {\n      color: inherit;\n      text-decoration: none;\n    }\n\n    .Card.transparent {\n      background: none;\n      box-shadow: none;\n    }\n\n    .Card.tiny {\n      border-radius: 4px;\n      min-height: auto;\n      padding: 0 3px;\n    }\n    \n    .Card.tiny img {\n      width: 18px;\n      height: 18px;\n      position: relative;\n      top: 3px;\n      marginRight: 2px;\n    }\n\n    .Card.small {\n      min-height: auto;\n      padding: 8px 12px;\n      margin: 0;\n    }\n\n    .CardImage.small {\n      width: 33px;\n    }\n\n    .CardImage.small img {\n      height: 27px;\n      width: 27px;\n    }\n\n    .CardImage.large {\n      width: 58px;\n    }\n\n    .CardImage.large img {\n      height: 58px;\n      width: 58px;\n    }\n\n    .Card.disabled {\n      cursor: default;\n    }\n\n    .Card:hover:not(.disabled) {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 90%, ").concat(style.colors.mixActive, " 10%);\n      box-shadow: 0 0 0 rgba(0,0,0,0); \n    }\n\n    .Card:active:not(.disabled) {\n      background-color: ").concat(style.colors.cardBackground, ");\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 85%, ").concat(style.colors.mixActive, " 15%);\n      box-shadow: inset 0 0 6px rgba(0,0,0,0.02);\n      color: inherit;\n    }\n\n    .Card.secondary {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 90%, ").concat(style.colors.mixActive, " 10%);\n    }\n\n    .Card.secondary:hover:not(.disabled) {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 85%, ").concat(style.colors.mixActive, " 15%);\n    }\n\n    .Card.secondary:active:not(.disabled) {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 80%, ").concat(style.colors.mixActive, " 20%);\n    }\n\n    .Card:hover:not(.disabled) .CardAction {\n      opacity: 0.4;\n    }\n\n    .CardImage, .CardBody, .CardAction, .CardInfo {\n      align-items: center;\n      display: flex;\n      min-width: 0;\n      padding: 0 7px;\n    }\n\n    .CardImage {\n      display: inline-flex;\n      flex-basis: auto;\n      flex-grow: 0;\n      flex-shrink: 0;\n      justify-content: center;\n      position: relative;\n      width: 52px;\n    }\n\n    .CardBody {\n      flex-basis: auto;\n      flex-grow: 1;\n      flex-shrink: 1;\n      line-height: 27px;\n      padding-left: 10px;\n      text-align: left;\n    }\n\n    .CardBodyWrapper {\n      min-width: 0;\n    }\n\n    .CardAction {\n      flex-basis: auto;\n      flex-shrink: 0;\n      flex-grow: 0;\n      padding-right: 0;\n      margin-left: auto;\n    }\n\n    .Card.disabled .CardAction {\n      opacity: 0;  \n    }\n\n    .CardInfo {\n      display: flex;\n      flex-basis: auto;\n      flex-direction: column;\n      flex-grow: 0;\n      flex-shrink: 1;\n      justify-content: center;\n      margin-left: auto; \n      padding-right: 0;\n    }\n\n    .CardImage img {\n      background: ").concat(style.colors.background, ";\n      border-radius: 9999px;\n      border: 1px solid ").concat(style.colors.cardBackground, ";\n      height: 42px;\n      position: relative;\n      vertical-align: middle;\n      width: 42px;\n    }\n\n    .CardImage.rounded img {\n      border-radius: 8px !important;\n    }\n\n    .CardImage.square img {\n      border-radius: 0;\n    }\n\n    .CardImage img.transparent {\n      border: none;\n      background: none;\n      box-shadow: none;\n    }\n    \n    .CardTitle {\n      font-size: 15px;\n      color: rgb(150,150,150);\n      line-height: 20px;\n    }\n\n    .CardText.small .CardTitle {\n      line-height: 14px;\n    }\n    \n    .CardText, a .CardText {\n      color: ").concat(style.colors.text, ";\n      flex: 1;\n      font-size: 21px;\n      line-height: 26px;\n    }\n\n    .CardText strong {\n      font-weight: 500;\n    }\n\n    .CardText.small, .CardText.small small {\n      font-size: 17px;\n      color: rgb(150,150,150);\n      line-height: 20px;\n    }\n\n    .CardAction {\n      opacity: 0.2;\n    }\n\n    .Card.inlineBlock {\n      display: inline-block;\n      width: auto;\n    }\n    \n    .Card.More {\n      display: inline-block;\n      text-align: center;\n    }\n  ");
});

var DialogStyle = (function (style) {
  return "\n\n    .ReactDialog {\n      user-select: none;\n    }\n\n    .ReactDialogBackground {\n      z-index: -2;\n      backdrop-filter: blur(5px);\n      background: rgba(0,0,0,0.7);\n    }\n\n    .contained .ReactDialog {\n      position: absolute;\n      height: 100%;\n      min-height: 100%;\n      width: 100%;\n      min-width: 100%;\n    }\n\n    .contained .ReactDialogBackground {\n      position: absolute;\n    }\n\n    .contained .ReactDialog.ReactDialogOpen .ReactDialogAnimation {\n      top: 0;\n    }\n\n    .Dialog {\n      margin: 0 auto;\n      position: relative;\n      width: 420px;\n      box-shadow: 0 0 22px rgba(0,0,0,0.3);\n      border-radius: 13px;\n      background: ".concat(style.colors.background, ";\n    }\n\n    @media (max-width: 450px) {\n\n      .Dialog {\n        border-radius: 0;\n        border-top-radius: 0;\n        width: 100%;\n      }\n\n      .DialogHeader {\n        border-top-left-radius: 0;\n        border-top-right-radius: 0;\n      }\n    }\n\n    @media (orientation: portrait) and (max-width: 600px) {\n\n      .ReactDialogAnimation {\n        width: 100%;\n      }\n\n      .ReactDialog {\n        height: 100%;\n        min-height: 100%;\n      }\n\n      .ReactDialogStack {\n        align-items: flex-end;\n      }\n\n      .Dialog {\n        align-content: stretch;\n        border-radius: 0px;\n        border-top-radius: 0px;\n        display: flex;\n        flex-direction: column;\n        border-bottom-left-radius: 0 !important;\n        border-bottom-right-radius: 0 !important;\n        width: 100%;\n      }\n\n      .DialogBody {\n        flex: 1;\n        align-items: flex-end;\n      }\n\n      .DialogFooter {\n        padding-bottom: 20px;\n      }\n\n      .ReactDialogAnimation {\n        margin-bottom: -100px !important;\n        top: inherit !important;\n        position: relative;\n        transition: opacity 0.4s ease, margin-bottom 0.4s ease;\n      }\n\n      .ReactDialog.ReactDialogOpen .ReactDialogAnimation {\n        margin-bottom: 0px !important;\n      }\n\n      .DialogFooter {\n        border-bottom-left-radius: 0 !important;\n        border-bottom-right-radius: 0 !important;\n      }\n\n      .ReactShadowDOMInsideContainer > .ReactDialog {\n        align-items: flex-end;\n      }\n    }\n\n    .DialogBody {\n      overflow-x: hidden;\n      overflow-y: auto;\n    }\n\n    .ScrollHeightAnimation {\n      transition: height 0.4s ease, max-height 0.4s ease;\n    }\n\n    .ScrollHeight {\n      height: 30vh !important;\n      max-height: 30vh !important;\n    }\n\n    .ScrollHeightS {\n      height: 180px !important;\n      max-height: 180px !important;\n    }\n\n    .ScrollHeightM {\n      height: 210px !important;\n      max-height: 210px !important;\n    }\n\n    .ScrollHeightL {\n      height: 250px !important;\n      max-height: 250px !important;\n    }\n\n    .ScrollHeightMax {\n      height: 60vh !important;\n      max-height: 60vh !important;\n    }\n\n    .DialogBody.MinHeight {\n      height: 120px !important;\n      max-height: 120px !important;\n    }\n\n    .DialogHeader {\n      border-top-left-radius: 13px;\n      border-top-right-radius: 13px;\n      min-height: 58px;\n      position: relative;\n      width: 100%;\n    }\n\n    .DialogHeaderActionRight {\n      position: absolute;\n      top: 0;\n      right: 0;\n      height: 48px;\n    }\n\n    .DialogHeaderActionLeft {\n      position: absolute;\n      top: 0;\n      left: 0;\n      height: 48px;\n    }\n\n    .DialogFooter {\n      border-bottom-left-radius: 13px;\n      border-bottom-right-radius: 13px;\n      line-height: 24px;\n      min-height: 32px;\n      position: relative;\n      text-align: center;\n    }\n\n  ");
});

var DropDownStyle = (function (style) {
  return "\n\n    .DropDownWrapper {\n      position: relative;\n    }\n\n    .DropDown {\n      background: ".concat(style.colors.background, ";\n      border-radius: 8px;\n      box-shadow: 0 0 12px ").concat(style.colors.background, ";\n      box-shadow: 0 0 12px color-mix(in srgb, ").concat(style.colors.background, " 80%, black 20%);\n      display: block;\n      padding: 8px 6px;\n      position: absolute;\n      right: 0;\n      z-index: 1000;\n    }\n\n    .DropDownItem {\n      border: 1px solid transparent;\n      border-radius: 6px;\n      cursor: pointer;\n      font-size: 17px;\n      min-width: 160px;\n      padding: 6px 10px;\n      text-align: left;\n      white-space: nowrap;\n      width: 100%;\n    }\n\n    .DropDownItem:focus {\n      border: 1px solid ").concat(style.colors.primary, ";\n    }\n\n    .DropDownItem:hover {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 90%, ").concat(style.colors.mixActive, " 10%);\n    }\n    \n    .DropDownItem:active {\n      background-color: ").concat(style.colors.cardBackground, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.cardBackground, " 85%, ").concat(style.colors.mixActive, " 15%);\n    }\n    \n  ");
});

var FontStyle = (function (style) {
  return "\n\n    *, div, div * {\n      font-family: ".concat(style.fontFamily, ";\n    }\n\n    * {\n      font-size: 15px;\n    }\n\n    .FontSizeS {\n      font-size: 16px;\n    }\n\n    .FontSizeM {\n      font-size: 19px;\n    }\n\n    .FontSizeL {\n      font-size: 23px;\n    }\n\n    .FontSizeXL {\n      font-size: 32px;\n    }\n\n    .FontSizeXXL {\n      font-size: 42px;\n    }\n\n    .FontWeightLight {\n      font-weight: 300;\n    }\n\n    .FontWeightMedium {\n      font-weight: 500;\n    }\n\n    .FontWeightBold {\n      font-weight: bold;\n    }\n\n    .FontItalic {\n      font-style: italic;\n    }\n  ");
});

var GraphicStyle = (function (style) {
  return "\n\n    .GraphicWrapper {\n      display: block;\n      padding: 10px 0;\n    }\n\n    .Graphic {\n      width: 50%;\n      position: relative;\n    }\n\n    .GraphicPassiveColor {\n      fill: ".concat(style.colors.mixPassive, ";\n    }\n\n    .GraphicActiveColor {\n      fill: ").concat(style.colors.mixActive, ";\n    }\n  ");
});

var GridStyle = (function (style) {
  return "\n\n    .Row {\n      overflow: hidden;\n    }\n\n    .Column {\n      float: left;\n    }\n\n    .Column2 {\n      width: 16.66%;\n    }\n\n    .Column10 {\n      width: 83.33%;\n    }\n  ";
});

var HeightStyle = (function () {
  return "\n\n    .MaxHeight {\n      max-height: 320px;\n      overflow-y: auto;\n    }\n  ";
});

var HorizontalRuleStyle = (function (style) {
  return "\n\n    hr {\n      all: unset;\n      display: block;\n      width: 100%;\n      height: 1px;\n      background-color: ".concat(style.colors.text, ";\n      opacity: 20%;\n      border: none;\n    }\n  ");
});

var IconStyle = (function (style) {
  return "\n\n    .Icon {\n      fill: ".concat(style.colors.text, ";\n      stroke: ").concat(style.colors.text, ";\n    }\n\n    .ChevronLeft, .ChevronRight {\n      position: relative;\n      top: 1px;\n    }\n\n    .ChevronLeft.small, .ChevronRight.small {\n      height: 12px;\n      width: 12px;\n    }\n\n    .Checkmark {\n      height: 24px;\n      position: relative;\n      top: -1px;\n      vertical-align: middle;\n      width: 24px;\n    }\n\n    .AlertIcon {\n      height: 20px;\n      position: relative;\n      top: -1px;\n      vertical-align: middle;\n      width: 20px;\n      fill: #e42626;\n      stroke: transparent;\n    }\n\n    .Checkmark.small {\n      height: 16px;\n      width: 16px;\n    }\n\n    .DigitalWalletIcon {\n      height: 24px;\n      position: relative;\n      top: -1px;\n      vertical-align: middle;\n      width: 24px;\n    }\n\n    .ButtonPrimary .Icon {\n      fill : ").concat(style.colors.buttonText, ";\n      stroke : ").concat(style.colors.buttonText, ";\n    }\n\n    .Loading {\n      animation: spin 1.5s linear infinite;\n      border-radius: 100%;\n      border: 3px solid ").concat(style.colors.primary, ";\n      border-top: 3px solid rgba(0,0,0,0.1);\n      display: inline-block;\n      height: 18px;\n      left: -1px;\n      position: relative;\n      width: 18px;\n    }\n\n    .Loading.medium {\n      border: 4px solid ").concat(style.colors.primary, ";\n      border-top: 4px solid rgba(0,0,0,0.1);\n      display: inline-block;\n      height: 22px;\n      position: relative;\n      top: 0;\n      width: 22px; \n    }\n\n    @keyframes spin {\n      0% { transform: rotate(0deg); }\n      100% { transform: rotate(360deg); }\n    }\n  ");
});

var InputStyle = (function (style) {
  return "\n\n    .Input {\n      background: none;\n      border: 1px solid transparent;\n      margin: 0;\n      outline: none !important;\n      padding: 0 0 0 14px;\n      width: 100%;\n    }\n\n    .Input::placeholder {\n      color: rgb(210,210,210);\n    }\n\n    .InputField {\n      border-radius: 13px;\n      border: 1px solid rgba(0,0,0,0.2);\n      background: ".concat(style.colors.cardBackground, ";\n      background: color-mix(in srgb, ").concat(style.colors.cardBackground, " 80%, ").concat(style.colors.mixPassive, " 20%);\n      outline: none !important;\n      color: ").concat(style.colors.text, ";\n      font-size: 19px;\n      padding: 13px;\n      width: 100%;\n    }\n\n    .InputField.small {\n      border-radius: 8px;\n      font-size: 15px;\n    }\n\n    .InputField::placeholder {\n      color: rgb(180,180,180);\n    } \n\n    .InputField:focus, .InputField:focus-visible {\n      border: 1px solid ").concat(style.colors.primary, ";\n    }\n    \n  ");
});

var LinkStyle = (function (style) {
  return "\n\n    .Link {\n      color: ".concat(style.colors.primary, ";\n      cursor: pointer;\n      text-decoration: none;\n    }\n\n    .Link:hover {\n      filter: brightness(0.8);\n    }\n\n    .Link:active {\n      filter: brightness(1.0);\n    }\n  ");
});

var LoadingTextStyle = (function (style) {
  return "\n\n    .LoadingText {\n      display: inline-block;\n      text-decoration: none;\n    }\n\n    @keyframes blink {\n      0% { opacity: .2; }\n      20% { opacity: 1; }\n      100% { opacity: .2; }\n    }\n    \n    .LoadingText .dot {\n      animation-name: blink;\n      animation-duration: 1.4s;\n      animation-iteration-count: infinite;\n      animation-fill-mode: both;\n    }\n    \n    .LoadingText .dot:nth-child(2) {\n      animation-delay: .2s;\n    }\n    \n    .LoadingText .dot:nth-child(3) {\n      animation-delay: .4s;\n    }\n  ";
});

var LogoStyle = (function (style) {
  return "\n\n    .BlockchainLogo {\n      border-radius: 6px !important;\n    }\n\n    .BlockchainLogo.small {\n      border-radius: 4px !important;\n      height: 20px;\n      width: 20px;\n    }\n\n    .BlockchainLogo.bottomRight {\n      position: absolute;\n      bottom: 0;\n      right: 0;\n    }\n\n    .SolanaPayLogo {\n      height: 34px;\n      position: relative;\n      top: 4px;\n      left: 4px;\n    }\n    \n    .SolanaPayLogo path {\n      fill: ".concat(isDarkMode() ? '#FFFFFF' : '#000000', ";\n    }\n  ");
});

var MarginStyle = (function () {
  return "\n\n    .MarginTopXS {\n      margin-top: 3px;\n    }\n\n    .MarginRightXS {\n      margin-right: 3px;\n    }\n\n    .MarginBottomXS {\n      margin-bottom: 3px;\n    }\n\n    .MarginLeftXS {\n      margin-left: 3px; \n    }\n\n    .MarginTopNegativeS {\n      margin-top: -13px;\n    }\n\n    .MarginTopS {\n      margin-top: 13px;\n    }\n\n    .MarginRightS {\n      margin-right: 13px;\n    }\n\n    .MarginBottomS {\n      margin-bottom: 13px;\n    }\n\n    .MarginLeftS {\n      margin-left: 13px; \n    }\n\n    .MarginTopM {\n      margin-top: 19px;\n    }\n\n    .MarginRightM {\n      margin-right: 19px;\n    }\n\n    .MarginBottomM {\n      margin-bottom: 19px;\n    }\n\n    .MarginLeftM {\n      margin-left: 19px; \n    }\n\n    .MarginTopL {\n      margin-top: 29px;\n    }\n\n    .MarginRightL {\n      margin-right: 29px;\n    }\n\n    .MarginBottomL {\n      margin-bottom: 29px;\n    }\n\n    .MarginLeftL {\n      margin-left: 29px; \n    }\n  ";
});

var OpacityStyle = (function (style) {
  return "\n\n    .Opacity03 {\n      opacity: 0.3;\n    }\n\n    .Opacity05 {\n      opacity: 0.5;\n    }\n  ";
});

var PaddingStyle = (function () {
  return "\n\n    .PaddingTopXS {\n      padding-top: 3px;\n    }\n\n    .PaddingRightXS {\n      padding-right: 3px;\n    }\n\n    .PaddingBottomXS {\n      padding-bottom: 3px;\n    }\n\n    .PaddingLeftXS {\n      padding-left: 3px; \n    }\n\n    .PaddingTopS {\n      padding-top: 13px;\n    }\n\n    .PaddingRightS {\n      padding-right: 13px;\n    }\n\n    .PaddingBottomS {\n      padding-bottom: 13px;\n    }\n\n    .PaddingLeftS {\n      padding-left: 13px; \n    }\n\n    .PaddingTopM {\n      padding-top: 19px;\n    }\n\n    .PaddingRightM {\n      padding-right: 19px;\n    }\n\n    .PaddingBottomM {\n      padding-bottom: 19px;\n    }\n\n    .PaddingLeftM {\n      padding-left: 19px; \n    }\n\n    .PaddingTopL {\n      padding-top: 29px;\n    }\n\n    .PaddingRightL {\n      padding-right: 29px;\n    }\n\n    .PaddingBottomL {\n      padding-bottom: 29px;\n    }\n\n    .PaddingLeftL {\n      padding-left: 29px; \n    }\n  ";
});

var PoweredByStyle = (function (style) {
  return "\n\n    .PoweredByWrapper {\n      display: block;\n      left: 0;\n      padding-top: 3px;\n      position: fixed;\n      right: 0;\n      text-align: center;\n      top: 0;\n      z-index: 999;\n    }\n\n    .contained .PoweredByWrapper {\n      position: absolute;\n    }\n\n    .PoweredByLink {\n      color: white;\n      display: inline-block;\n      font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\" !important;\n      font-size: 14px;\n      font-style: italic;\n      font-weight: bold;\n      letter-spacing: -0.2px;\n      margin-left: 8px;\n      opacity: 0.5;\n      text-decoration: none;\n      text-shadow: black 0 0 2px;\n    }\n\n    .PoweredByLink:hover, .PoweredByLink:active {\n      opacity: 1.0;\n    }\n  ";
});

var StepStyle = (function (style) {
  return "\n\n    .StepsWrapper {\n      position: relative;\n    }\n\n    .Step {\n      display: flex !important;\n      align-items: center;\n      width: 100%;\n      opacity: 50%;\n      padding-left: 0 !important;\n      position: relative;\n    }\n\n    .Step .ActionIndicatorSpinner {\n      border: 2px solid ".concat(style.colors.primary, ";\n      border-bottom-color: ").concat(style.colors.background, ";\n      border-bottom-color: color-mix(in srgb, ").concat(style.colors.background, " 90%, ").concat(style.colors.mixActive, " 10%);\n      height: 14px;\n      width: 14px;\n    }\n\n    .Step.Card.small {\n      padding: 6px 12px;\n    }\n\n    .Step.active {\n      opacity: 100%;\n    }\n\n    .StepIcon {\n      width: 40px;\n      position: relative;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }\n    \n    .StepCircle {\n      border-radius: 999px;\n      height: 12px;\n      width: 12px;\n      border: 2px solid ").concat(style.colors.text, ";\n      background: none;\n      position: relative;\n    }\n\n    .Step.active .StepCircle {\n      background: ").concat(style.colors.text, ";\n    }\n\n    .StepConnector {\n      width: 2px;\n      height: 19px;\n      position: absolute;\n      left: 20px;\n      background: ").concat(style.colors.text, ";\n      opacity: 0.5;\n      z-index: 999;\n      margin-top: -10px;\n    }\n\n    .StepConnector:last-child {\n      display: none;\n    }\n\n    .Step.done:last-child {\n      opacity: 100;\n    }\n\n    .StepText {\n      text-align: left;\n      display: flex;\n      align-items: center;\n      position: relative;\n    }\n\n  ");
});

var QRCodeStyle = (function () {
  return "\n\n    .QRCode {\n      width: 100%;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    }\n  ";
});

var RadioStyle = (function (style) {
  return "\n\n    .Radio {\n      display: flex;\n      align-items: center;\n      cursor: pointer;\n      gap: 0.5em;\n    }\n\n    .Radio span {\n      font-size: 19px;\n      position: relative;\n      top: -1px;\n      padding-left: 2px;\n    }\n\n    .Radio input[type=\"radio\"] {\n      appearance: none;\n      -webkit-appearance: none;\n      width: 20px;\n      height: 20px;\n      border: 2px solid ".concat(style.colors.primary, ";\n      border-radius: 50%;\n      position: relative;\n      cursor: pointer;\n      outline: none;\n      margin: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .Radio input[type=\"radio\"]::before {\n      content: '';\n      width: 10px;\n      height: 10px;\n      background-color: ").concat(style.colors.primary, ";\n      border-radius: 50%;\n      transform: scale(0);\n      transition: transform 0.2s ease-in-out;\n    }\n\n    .Radio input[type=\"radio\"]:checked::before {\n      transform: scale(1);\n    }\n  ");
});

var RangeSliderStyle = (function (style) {
  return "\n\n    .rangeslider {\n      margin: 20px 0;\n      position: relative;\n      background: #e6e6e6;\n      -ms-touch-action: none;\n      touch-action: none;\n    }\n\n    .rangeslider,\n    .rangeslider__fill {\n      display: block;\n      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);\n    }\n\n    .rangeslider__handle {\n      outline: none;\n      cursor: pointer;\n      display: inline-block;\n      position: absolute;\n      border-radius: 50%;\n      background-color: " + style.colors.primary + ";\n      border: 1px solid white;\n      box-shadow: 0 0 8px rgba(0,0,0,0.1);\n    }\n\n    .rangeslider__handle:hover {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.2);\n    }\n\n    .rangeslider__handle:active {\n      box-shadow: inset 0 0 300px rgba(0,0,0,0.3);\n    }\n\n    .rangeslider__active {\n      opacity: 1;\n    }\n\n    .rangeslider__handle-tooltip {\n      display: none;\n    }\n\n    .rangeslider-horizontal {\n      height: 12px;\n      border-radius: 10px;\n    }\n\n    .rangeslider-horizontal .rangeslider__fill {\n      height: 100%;\n      background-color: " + style.colors.primary + ";\n      border-radius: 10px;\n      top: 0;\n    }\n    .rangeslider-horizontal .rangeslider__handle {\n      width: 18px;\n      height: 18px;\n      border-radius: 30px;\n      top: 50%;\n      transform: translate3d(-50%, -50%, 0);\n    }\n\n\n    .rangeslider-horizontal .rangeslider__handle-tooltip {\n      top: -55px;\n    }\n\n  ";
});

var ResetStyle = (function () {
  return "\n\n      html, body, div, span, applet, object, iframe,\n      h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n      a, abbr, acronym, address, big, cite, code,\n      del, dfn, em, img, ins, kbd, q, s, samp,\n      small, strike, strong, sub, sup, tt, var,\n      b, u, i, center,\n      dl, dt, dd, ol, ul, li,\n      fieldset, form, label, legend,\n      table, caption, tbody, tfoot, thead, tr, th, td,\n      article, aside, canvas, details, embed, \n      figure, figcaption, footer, header, hgroup, \n      menu, nav, output, ruby, section, summary,\n      time, mark, audio, video {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        font-size: 100%;\n        font: inherit;\n        text-align: inherit;\n        vertical-align: baseline;\n      }\n\n      article, aside, details, figcaption, figure, \n      footer, header, hgroup, menu, nav, section {\n        display: block;\n      }\n\n      body {\n        line-height: 1;\n      }\n\n      ol, ul {\n        list-style: none;\n      }\n\n      blockquote, q {\n        quotes: none;\n      }\n\n      blockquote:before, blockquote:after,\n      q:before, q:after {\n        content: '';\n        content: none;\n      }\n      \n      table {\n        border-collapse: collapse;\n        border-spacing: 0;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      button {\n        border: 0;\n        background: none;\n        outline: none;\n      }\n\n  ";
});

var SearchStyle = (function (style) {
  return "\n\n    .Search {\n      border-radius: 13px;\n      border: 1px solid transparent;\n      background: none;\n      outline: none !important;\n      color: ".concat(style.colors.text, ";\n      font-size: 19px;\n      padding: 8px 12px;\n      width: 100%;\n      position: relative !important; // fixes LastPass extension problem\n    }\n\n    .Search.small {\n      padding: 4px 8px;\n      font-size: 16px;\n      border-radius: 6px;\n    }\n\n    .Search::placeholder {\n      color: ").concat(style.colors.text, ";\n      color: color-mix(in srgb, ").concat(style.colors.text, " 55%, ").concat(style.colors.mixPassive, " 50%);\n    } \n\n    .Search:focus::placeholder, .Search:focus-visible::placeholder {\n      color: ").concat(style.colors.text, ";\n      color: color-mix(in srgb, ").concat(style.colors.text, " 65%, ").concat(style.colors.mixPassive, " 35%);\n    } \n\n    .Search:focus, .Search:focus-visible {\n      border: 1px solid ").concat(style.colors.primary, ";\n      background: none;\n    }\n\n  ");
});

var SkeletonStyle = (function (style) {
  return "\n        \n    .Skeleton {\n      background: ".concat(style.colors.background, " !important;\n      background: color-mix(in srgb, ").concat(style.colors.background, " 95%, ").concat(style.colors.mixActive, " 5%) !important;\n      border: 0px solid transparent !important;\n      box-shadow: none !important;\n      cursor: inherit !important;\n      line-height: 0;\n      overflow: hidden;\n      position: relative;\n    }\n\n    .Card .Skeleton {\n      background: ").concat(style.colors.cardBackground, " !important;\n      background: color-mix(in srgb, ").concat(style.colors.cardBackground, " 95%, ").concat(style.colors.mixActive, " 5%) !important;\n    }\n\n    .Card .Skeleton .SkeletonBackground {\n      background: linear-gradient(to right, transparent 0%, ").concat(style.colors.cardBackground, " 50%, transparent 100%);\n      background: linear-gradient(to right, transparent 0%, color-mix(in srgb, ").concat(style.colors.cardBackground, " 90%, ").concat(style.colors.mixActive, " 10%) 50%, transparent 100%);\n    }\n\n    @keyframes SkeletonBackgroundAnimation {\n      from {\n        left: -500px;\n      }\n      to   {\n        left: +120%;\n      }\n    }\n\n    .SkeletonBackground {\n      animation: 2s SkeletonBackgroundAnimation 0.2s ease infinite;\n      background: linear-gradient(to right, transparent 0%, ").concat(style.colors.background, " 50%, transparent 100%);\n      background: linear-gradient(to right, transparent 0%, color-mix(in srgb, ").concat(style.colors.background, " 80%, ").concat(style.colors.mixActive, " 20%) 50%, transparent 100%);\n      height: 100%;\n      left: -140%;\n      position: absolute;\n      top: 0;\n      width: 400px;\n    }\n\n    .SkeletonWrapper {\n      line-height: 0;\n    }\n  ");
});

var TabBarStyle = (function (style) {
  return "\n\n    .TabBar {\n      display: flex;\n    }\n\n    .TabBar .Search {\n      position: relative;\n    }\n  ";
});

var TableStyle = (function (style) {
  return "\n\n    .Table {\n      border-collapse: separate;\n      border-radius: 7px;\n      border-style: hidden;\n      border: 1px solid rgba(0,0,0,0.1);\n      width: 100%;\n    }\n\n    .Table tr.small td {\n      font-size: 14px;\n    }\n\n    .Table tr td {\n      border-bottom: 1px solid rgba(0,0,0,0.1);\n      word-break: break-all;\n    }\n    \n    .Table tr:last-child td {\n      border-bottom: none;\n    }\n    \n    .Table tr td {\n      padding: 8px 15px;\n      text-align: left;\n    }\n    \n    .Table tr td:first-child {\n      width: 30%\n    }\n\n    .Table tr td:last-child {\n      width: 70%\n    }\n    \n    .Table .TableSubTitle {\n      font-weight: 300;\n      opacity: 0.7;\n    }\n\n    .Table tr td:last-child {\n      font-weight: 500;\n    }\n  ";
});

var TabStyle = (function (style) {
  return "\n\n    .Tab {\n      padding: 3px 7px;\n      margin-right: 3px;\n      font-size: 17px;\n      border-radius: 4px;\n      cursor: pointer;\n    }\n\n    .Tab.active {\n      background-color: ".concat(style.colors.background, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.background, " 90%, ").concat(style.colors.mixActive, " 10%);\n      box-shadow: 0 0 4px rgba(0,0,0,0.03);\n    }\n\n    .Tab:hover:not(.active) {\n      background-color: ").concat(style.colors.background, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.background, " 90%, ").concat(style.colors.mixActive, " 10%);\n      box-shadow: 0 0 0 rgba(0,0,0,0); \n    }\n\n    .Tab:active:not(.active) {\n      background-color: ").concat(style.colors.background, ";\n      background-color: color-mix(in srgb, ").concat(style.colors.background, " 95%, ").concat(style.colors.mixActive, " 5%);\n      box-shadow: inset 0 0 4px rgba(0,0,0,0.02);\n    }\n\n    .Tab.search {\n      display: flex;\n    }\n  ");
});

var TextButtonStyle = (function (style) {
  return "\n\n    .TextButton {\n      cursor: pointer;\n      font-size: 16px;\n      color: ".concat(style.colors.primary, "\n    }\n\n    .TextButton:hover * {\n      opacity: 1.0;\n    }\n  ");
});

var TextStyle = (function (style) {
  return "\n\n    * {\n      color: ".concat(style.colors.text, ";\n    }\n\n    .TextColorSuccess {\n      color: ").concat(style.colors.success, ";\n    }\n\n    h1, h2, h3, h4, h5, h6 {\n      display: block;\n    }\n\n    .Text {\n      font-size: 16px;\n      line-height: 24px\n    }\n\n    .TextLeft, .TextLeft * {\n      text-align: left !important;\n    }\n\n    .TextCenter, .TextCenter * {\n      text-align: center;\n    }\n\n    .LineHeightXS {\n      line-height: 16px;\n    }\n\n    .LineHeightL {\n      line-height: 32px;\n    }\n\n    .ErrorSnippetText {\n      background: rgb(30, 30, 20);\n      border-radius: 19px;\n      border: 8px solid rgb(30, 30, 20);\n      color: #00FF41;\n      font-size: 15px;\n      font-style: italic;\n      max-height: 100px;\n      padding: 6px;\n      overflow-wrap: break-word;\n      overflow-y: auto;\n      user-select: all;\n      white-space: pre-wrap;\n      word-wrap: break-word;\n    }\n\n    .ResponsiveText {\n      font-size: clamp(14px, 2vw, 15px);\n      max-width: fit-content;\n    }\n  ");
});

var TokenAmountStyle = (function () {
  return "\n        \n    .TokenAmountRow {\n      min-width: 0;\n      width: 100%;\n      display: flex;\n      flex-direction: row;\n    }\n    \n    .TokenAmountRow.small {\n      font-size: 17px;\n      line-height: 17px;\n    }\n\n    .TokenAmountCell {\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    .TokenSymbolCell {\n    }\n  ";
});

var TokenImageStyle = (function (style) {
  return "\n\n    .TokenImage img {\n      border-radius: 9999px;\n      border: 1px solid white;\n      background: white;\n      box-shadow: 0 2px 8px rgb(0 0 0 / 10%);\n      height: 45px;\n      position: relative;\n      vertical-align: middle;\n      width: 45px;\n    }\n\n    .TokenImage.medium img {\n      height: 93px;\n      width: 93px;\n    }\n  ";
});

var TooltipStyle = (function (style) {
  return "\n\n    .TooltipWrapper {\n      position: relative;\n    }\n\n    .Tooltip {\n      background: ".concat(style.colors.primary, ";\n      border-radius: 10px;\n      color: ").concat(style.colors.buttonText, ";\n      padding: 10px 13px;\n      position: relative;\n      box-shadow: 0 0 8px rgba(0,0,0,0.2);\n    }\n\n    .Tooltip.absolute {\n      position: absolute;\n    }\n\n    .Tooltip.top {\n      top: -40px;\n    }\n\n    .TooltipArrowUp {\n      border-bottom: 10px solid ").concat(style.colors.primary, ";\n      border-left: 10px solid transparent;\n      border-right: 10px solid transparent;\n      height: 0; \n      left: 12px;\n      position: absolute;\n      top: -8px;\n      width: 0; \n    }\n\n    .TooltipArrowDown {\n      border-top: 10px solid ").concat(style.colors.primary, ";\n      border-left: 10px solid transparent;\n      border-right: 10px solid transparent;\n      height: 0; \n      left: 12px;\n      position: absolute;\n      bottom: -8px;\n      width: 0; \n    }\n  ");
});

var WalletStyle = (function (style) {
  return "\n\n    .WalletLogoS {\n      background: none !important;\n      border-radius: 8px !important;\n      border: 1px solid transparent !important;\n      box-shadow: none !important;\n      height: 40px !important;\n      width: 40px !important;\n    }\n  ";
});

var styleRenderer = (function (style) {
  var _style, _style2, _style3, _style4;

  var defaultColors = !isDarkMode() ? {
    // LIGHT MODE
    primary: '#ea357a',
    buttonText: '#ffffff',
    text: '#212529',
    warning: '#bd2e21',
    success: '#32a03c',
    background: '#f2f2f2',
    cardBackground: '#ffffff',
    mixActive: '#000000',
    mixPassive: '#ffffff'
  } : {
    // DARK MODE
    primary: '#c21e5d',
    buttonText: '#ffffff',
    text: '#d5d9dd',
    warning: '#d55448',
    success: '#65c86e',
    background: '#171717',
    cardBackground: '#252525',
    mixActive: '#aaaaaa',
    mixPassive: '#000000'
  };
  var configuredColors = (isDarkMode() ? (_style = style) === null || _style === void 0 ? void 0 : _style.colorsDarkMode : (_style2 = style) === null || _style2 === void 0 ? void 0 : _style2.colors) || ((_style3 = style) === null || _style3 === void 0 ? void 0 : _style3.colors);
  style = {
    colors: Object.assign(defaultColors, configuredColors || {}),
    fontFamily: ((_style4 = style) === null || _style4 === void 0 ? void 0 : _style4.fontFamily) || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  };
  return [ResetStyle(), ActionIndicatorStyle(style), DialogStyle(style), ButtonCircularStyle(style), ButtonPrimaryStyle(style), CardStyle(style), PoweredByStyle(), StepStyle(style), QRCodeStyle(), GraphicStyle(style), GridStyle(), SkeletonStyle(style), TokenAmountStyle(), TextStyle(style), FontStyle(style), IconStyle(style), OpacityStyle(), PaddingStyle(), MarginStyle(), HeightStyle(), HorizontalRuleStyle(style), TabBarStyle(), TabStyle(style), LoadingTextStyle(), RadioStyle(style), RangeSliderStyle(style), InputStyle(style), TextButtonStyle(style), LogoStyle(), SearchStyle(style), TokenImageStyle(), AlertStyle(style), InfoStyle(style), TableStyle(), LinkStyle(style), TooltipStyle(style), WalletStyle(), DropDownStyle(style)].join('');
});

var mount = (function (_ref, content) {
  var style = _ref.style,
      container = _ref.container,
      document = _ref.document,
      closed = _ref.closed;
  var insideStyle = styleRenderer(style);

  if (style && style.css) {
    insideStyle = [insideStyle, style.css].join(' ');
  }

  var unmountShadowDOM = function unmountShadowDOM() {
    // setTimeout to allow dialog to animate out first
    setTimeout(function () {
      unmount();

      if (typeof closed == 'function') {
        closed();
      }
    }, 300);
  };

  var outsideStyle;

  if (container) {
    outsideStyle = "\n      position: absolute;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      z-index: 99999;\n    ";
  } else {
    outsideStyle = "\n      position: fixed;\n      top: 0;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      z-index: 99999;\n    ";
  }

  var _ReactShadowDOM = ReactShadowDOM({
    document: document,
    element: container || document.body,
    content: content(unmountShadowDOM),
    outsideStyle: outsideStyle,
    insideStyle: insideStyle,
    insideClasses: container ? ['contained'] : []
  }),
      unmount = _ReactShadowDOM.unmount;

  return unmount;
});

var requireReactVersion = (function () {
  if (parseInt(React.version.split('.')[0]) < 17) {
    throw 'depay/widgets require at least React v17';
  }
});

var SelectionContext = /*#__PURE__*/React.createContext();

var SelectionProvider = (function (props) {
  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      selection = _useState2[0],
      setSelection = _useState2[1];

  return /*#__PURE__*/React.createElement(SelectionContext.Provider, {
    value: {
      selection: selection,
      setSelection: setSelection
    }
  }, props.children);
});

var UpdatableProvider = (function (props) {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      updatable = _useState2[0],
      setUpdatable = _useState2[1];

  return /*#__PURE__*/React.createElement(UpdatableContext.Provider, {
    value: {
      updatable: updatable,
      setUpdatable: setUpdatable
    }
  }, props.children);
});

var Connect = function Connect(options) {
  requireReactVersion();
  var style, error, document;

  if (_typeof(options) == 'object') {
    style = options.style;
    error = options.error;
    document = options.document;
  }

  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mount({
                style: style,
                document: ensureDocument(document)
              }, function (unmount) {
                var rejectBeforeUnmount = function rejectBeforeUnmount() {
                  reject('USER_CLOSED_DIALOG');
                  unmount();
                };

                return function (container) {
                  return /*#__PURE__*/React.createElement(ErrorProvider, {
                    errorCallback: error,
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
                    unmount: rejectBeforeUnmount
                  }, /*#__PURE__*/React.createElement(SelectionProvider, null, /*#__PURE__*/React.createElement(ConnectStack, {
                    document: document,
                    container: container,
                    resolve: resolve,
                    reject: reject,
                    autoClose: true
                  }), /*#__PURE__*/React.createElement(PoweredBy, null)))));
                };
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var NavigateContext = /*#__PURE__*/React.createContext();

var LoadingText = (function (props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "LoadingText"
  }, props.children, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "."));
});

var LoadingDialog = (function (props) {
  return /*#__PURE__*/React.createElement(Dialog$1, {
    closable: false,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, /*#__PURE__*/React.createElement(LoadingText, null, "Loading"))),
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonWrapper PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ButtonPrimary Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })))), props.text !== false && /*#__PURE__*/React.createElement("div", {
      className: "TextCenter Opacity05 PaddingTopXS"
    }, /*#__PURE__*/React.createElement("strong", null, props.text)))
  });
});

var LoadingStack = (function (props) {
  var _useContext = useContext(ClosableContext),
      open = _useContext.open,
      close = _useContext.close;

  var _useContext2 = useContext(NavigateContext),
      setNavigator = _useContext2.setNavigator;

  return /*#__PURE__*/React.createElement(ReactDialogStack, {
    setNavigator: setNavigator,
    open: open,
    close: close,
    start: "Loading",
    container: props.container,
    document: props.document,
    dialogs: {
      Loading: /*#__PURE__*/React.createElement(LoadingDialog, {
        text: props.text
      })
    }
  });
});

var NavigateProvider = (function (props) {
  var navigator;

  var setNavigator = function setNavigator(_navigator) {
    navigator = _navigator;
  };

  var navigate = function navigate(dialog) {
    if (navigator) {
      navigator.navigate(dialog);
    }
  };

  var set = function set(dialogs) {
    if (navigator) {
      navigator.set(dialogs);
    }
  };

  return /*#__PURE__*/React.createElement(NavigateContext.Provider, {
    value: {
      navigate: navigate,
      set: set,
      setNavigator: setNavigator
    }
  }, props.children);
});

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtqsu0wy94cpz90W4pGsJ\nSf0bfvmsq3su+R1J4AoAYz0XoAu2MXJZM8vrQvG3op7OgB3zze8pj4joaoPU2piT\ndH7kcF4Mde6QG4qKEL3VE+J8CL3qK2dUY0Umu20x/O9O792tlv8+Q/qAVv8yPfdM\nn5Je9Wc7VI5XeIBKP2AzsCkrXuzQlR48Ac5LpViNSSLu0mz5NTBoHkW2sz1sNWc6\nUpYISJkiKTvYc8Bo4p5xD6+ZmlL4hj1Ad/+26SjYcisX2Ut4QD7YKRBP2SbItVkI\nqp9mp6c6MCKNmEUkosxAr0KVfOcrk6/fcc4tI8g+KYZ32G11Ri8Xo4fgHH06DLYP\n3QIDAQAB\n-----END PUBLIC KEY-----\n";
var ConfigurationProvider = (function (props) {
  var _props$configuration, _props$configuration5;

  var currencyCode = typeof props.configuration.currency === 'string' ? new Currency({
    code: props.configuration.currency
  }).code : new Currency({
    amount: 0
  }).code;

  var _useContext = useContext(ErrorContext),
      setError = _useContext.setError;

  var _useState = useState(!((_props$configuration = props.configuration) !== null && _props$configuration !== void 0 && _props$configuration.integration) ? _objectSpread$5(_objectSpread$5({}, props.configuration), {}, {
    currencyCode: currencyCode
  }) : undefined),
      _useState2 = _slicedToArray(_useState, 2),
      configuration = _useState2[0],
      setConfiguration = _useState2[1];

  var loadConfiguration = function loadConfiguration(id, attempt) {
    var _props$configuration2;

    if (attempt > 3) {
      var msg = 'Unable to load payment configuration!';
      setError(msg);
      throw msg;
    }

    var retry = function retry() {
      setTimeout(function () {
        return loadConfiguration(id, attempt + 1);
      }, 1000);
    };

    fetch("https://public.depay.com/configurations/".concat(id, "?v=3"), {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: (_props$configuration2 = props.configuration) !== null && _props$configuration2 !== void 0 && _props$configuration2.payload ? JSON.stringify({
        payload: props.configuration.payload
      }) : undefined
    })["catch"](retry).then( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(response) {
        var _JSON$parse, configurationId, _configuration, verified, _configuration$accept, localConfigurationWithValues, _msg, _msg2;

        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(response.status == 200)) {
                  _context.next = 26;
                  break;
                }

                _context.t0 = JSON;
                _context.next = 4;
                return response.text();

              case 4:
                _context.t1 = _context.sent;
                _JSON$parse = _context.t0.parse.call(_context.t0, _context.t1);
                configurationId = _JSON$parse.id;
                _configuration = _JSON$parse.configuration;
                _context.next = 10;
                return verify({
                  signature: response.headers.get('x-signature'),
                  publicKey: PUBLIC_KEY,
                  data: JSON.stringify(_configuration)
                });

              case 10:
                verified = _context.sent;

                if (!verified) {
                  _context.next = 21;
                  break;
                }

                localConfigurationWithValues = Object.entries(props.configuration).reduce(function (acc, _ref2) {
                  var _ref3 = _slicedToArray(_ref2, 2),
                      key = _ref3[0],
                      value = _ref3[1];

                  if (value !== undefined) {
                    acc[key] = value;
                  }

                  return acc;
                }, {});

                if (!(_configuration !== null && _configuration !== void 0 && _configuration.accept) || !(_configuration !== null && _configuration !== void 0 && (_configuration$accept = _configuration.accept) !== null && _configuration$accept !== void 0 && _configuration$accept.length) > 0) {
                  // Configuration is missing token acceptance!
                  loadConfiguration(id, attempt + 1);
                }

                if (!_configuration.accept.some(function (configuration) {
                  return !configuration.protocolFee;
                })) {
                  _context.next = 18;
                  break;
                }

                _msg = 'Configuration is missing protocol fee!';
                setError(_msg);
                throw _msg;

              case 18:
                setConfiguration(_objectSpread$5(_objectSpread$5(_objectSpread$5({}, _configuration), localConfigurationWithValues), {}, {
                  id: configurationId,
                  currencyCode: currencyCode
                }));
                _context.next = 24;
                break;

              case 21:
                _msg2 = 'Configuration response not verified!';
                setError(_msg2);
                throw _msg2;

              case 24:
                _context.next = 27;
                break;

              case 26:
                retry();

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  };

  useEffect(function () {
    if ((configuration === null || configuration === void 0 ? void 0 : configuration.providers) != undefined) {
      Object.entries(props.configuration.providers).forEach(function (entry) {
        setProviderEndpoints(entry[0], entry[1]);
      });
    }
  }, [configuration]);
  useEffect(function () {
    var _props$configuration3;

    if ((_props$configuration3 = props.configuration) !== null && _props$configuration3 !== void 0 && _props$configuration3.integration) {
      var _props$configuration4;

      loadConfiguration((_props$configuration4 = props.configuration) === null || _props$configuration4 === void 0 ? void 0 : _props$configuration4.integration, 1);
    }
  }, [props.configuration]);

  if ((_props$configuration5 = props.configuration) !== null && _props$configuration5 !== void 0 && _props$configuration5.integration && !configuration) {
    return /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
      unmount: props.unmount,
      closable: false
    }, /*#__PURE__*/React.createElement(NavigateProvider, null, /*#__PURE__*/React.createElement(PoweredBy, null), /*#__PURE__*/React.createElement(LoadingStack, {
      text: false,
      document: props.document,
      container: props.container
    }))));
  } else {
    return /*#__PURE__*/React.createElement(ConfigurationContext.Provider, {
      value: configuration
    }, props.children);
  }
});

var Loading = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
    var text, style, error, critical, container, document, unmount;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            text = _ref.text, style = _ref.style, error = _ref.error, critical = _ref.critical, container = _ref.container, document = _ref.document;
            requireReactVersion();
            _context.prev = 2;
            unmount = mount({
              style: style,
              container: container,
              document: ensureDocument(document),
              closed: closed
            }, function (unmount) {
              return function (container) {
                return /*#__PURE__*/React.createElement(ErrorProvider, {
                  errorCallback: error,
                  container: container,
                  unmount: unmount
                }, /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
                  unmount: unmount,
                  closable: false
                }, /*#__PURE__*/React.createElement(NavigateProvider, null, /*#__PURE__*/React.createElement(PoweredBy, null), /*#__PURE__*/React.createElement(LoadingStack, {
                  text: text,
                  document: document,
                  container: container
                })))));
              };
            });
            window._depayUnmountLoading = unmount;
            return _context.abrupt("return", {
              unmount: unmount
            });

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            console.log('critical error', _context.t0);

            if (critical != undefined) {
              critical(_context.t0);
            }

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8]]);
  }));

  return function Loading(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var LoginIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: ["LoginIcon Icon", props.className].filter(Boolean).join(' '),
    xmlns: "http://www.w3.org/2000/svg",
    width: props.width,
    height: props.width,
    viewBox: "0 0 2432.5 2433.7"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2428.5,1122.9c-1.5-20.5-3.6-40.9-6.1-61.2,0-.3,0-.7,0-1-.3-2-.5-4-.7-6,0-.2,0-.4-.1-.7-9.7-76.1-26.4-150.8-51.9-223.3-.1-.4-.2-.7-.3-1.1-51.1-155.9-130.4-294.2-237.8-414.7,0,0,0-.1,0-.1-3.4-6-8.2-11.1-13.7-15.1-46.1-50-97.2-96.9-153.3-140.5-3.1-3.2-6.7-6.3-10.8-9.3-19.7-14.6-39.5-28.7-59.5-42-.4-.2-.8-.6-1.2-.8-.8-.6-1.6-1.1-2.5-1.6-68.6-46.6-140.8-85.1-215.6-115.7-.8-.4-1.6-.7-2.5-1.1-115.2-47.6-234.9-75.9-358.8-84.8-237.2-18.9-478.2,31.7-688.5,149.1-7.3,4.1-14.5,8.2-21.7,12.3-4.1,2.4-8.1,4.8-12.2,7.2-3.6,2.2-7.2,4.3-10.7,6.5-4.2,2.5-8.5,5.2-12.7,7.9-4,2.5-8,5.1-12,7.6-4.2,2.7-8.4,5.5-12.6,8.3-4.2,2.8-8.4,5.6-12.5,8.4-4.4,3-8.9,6.1-13.2,9.2-4.4,3-8.7,6.1-13.1,9.3-3.7,2.6-7.2,5.3-10.8,8-1.5,1.1-3.1,2.3-4.6,3.4-4.1,3.1-8.3,6.3-12.4,9.4-7.7,5.9-15.2,12-22.7,18.1-1.7,1.3-3.4,2.7-5,4.1-1.5,1.1-2.9,2.3-4.2,3.5-1.1,1-2.3,1.9-3.4,2.9-1,.8-1.9,1.6-2.9,2.4-4.9,4.1-9.8,8.3-14.7,12.5-.2.2-.4.4-.6.6-2.2,1.9-4.5,3.9-6.7,5.9-70.8,61.6-134.4,131.1-189,207.3-3.2,4.4-6.3,8.7-9.4,13.2-2,2.8-4,5.6-6,8.5-1.2,1.7-2.4,3.5-3.5,5.2-67.2,97.7-118.5,203-153.3,316.1-.1.4-.3.9-.4,1.3C23,952.5,4.5,1058,.8,1166.3c-.8,24.3-1,48.5-.6,72.4,1,90.1,11.6,177.7,31.9,262.6,1.6,7,3.3,14,5.1,21,40.3,159.6,113.6,307.6,220.3,443,.2.4.6.8.9,1.1,14.6,19.1,29.4,38,43.8,57.1l107.5,107.5c10.1,7.7,20.2,15.5,30.3,23.4,97,81.5,204.1,145.5,321,191.7,107.3,43.8,219.3,71.1,335.8,81.8,14.4,1.9,28.9,3.7,43.3,5.8h152c30-4.1,60.2-7.5,90.2-11.7,7.3-1,14.5-2.1,21.7-3.2,3.6-.6,7.2-1.1,10.8-1.7,3.6-.6,7.2-1.2,10.8-1.8.4,0,.7-.1,1.1-.2,78.2-13.2,153.6-33.8,226-61.8,5.2-2,10.4-4,15.6-6.1,115-45.4,220.6-107.7,316.4-186.9.1-.1.2-.2.4-.3,12.3-9.8,24.8-19.3,37.2-28.9,35.9-35.8,71.7-71.7,107.5-107.5,3.4-5.3,6.1-11.1,10.2-15.8,1.8-2.1,3.7-4.3,5.4-6.5,1.5-1.6,2.8-3.1,4-4.7,4.8-5.6,9.4-11.1,14-16.8,44.5-54.4,84.1-112,117.6-173.2.3-.4.5-.9.8-1.4,78.7-141.7,126.5-297.1,144.8-465.1,1.7-15.6,3.9-31.2,5.8-46.7v-152c-1.4-6.1-3.5-12.2-4-18.4ZM2328.5,1355c-5.8,47.3-14.2,93.3-25.2,138-.4,1.5-.9,3-1.3,4.6-38.7,145.7-100.9,276-186.8,390.6-3.7,5-7.5,10-11.4,14.9-1.7,2.2-3.4,4.4-5.2,6.6-2,2.7-4.1,5.3-6.3,7.9-4.2,5.3-8.6,10.6-13.1,15.9-7.9,9.4-16,18.7-24.3,28-8.2,9.2-16.7,18.4-25.3,27.4-2.2,2.4-4.6,4.8-7,7.2-17.2,17.7-35.2,35-53.9,51.8-2.7,2-5.7,3.9-8.7,6.1-76.8-337.5-359.3-575.8-694.2-597.3-51.8-3.4-102.3-1.8-151.4,4.4-35.4,4.6-70.1,11.5-104,21.1-89.2,24.9-173.3,67-251.8,126.2-149.5,112.6-243.3,262.7-285.8,444.7-3.3-1.2-5-1.5-6.1-2.1,0,0-.1,0-.1,0-7.5-6.8-15-13.5-22.3-20.5-46.8-45.4-88.8-92.6-126.3-141.7-2.5-3.3-5-6.6-7.5-9.9-132.8-177.8-204.7-378.8-213.8-602.2h0c-2.3-57.8-.5-117,5.5-177.6,9.6-96.9,30-188.7,60.9-274.9.5-1.3,1-2.7,1.5-4.1,59.6-160.7,157.7-303.8,294.5-428.4,19.6-17.3,40.1-34.2,61.3-50.5,157-120.6,320.4-196.9,489.5-229.5.4,0,.8-.1,1.2-.2,106.7-18.8,217.9-20.8,332.7-5.8,60.9,8,119.3,19.4,175,34.3,56.9,16.5,114.4,37.4,172.2,62.6,73.9,32.2,139.8,82.8,208.8,125.9,5.3,3.4,10.8,6,16.1,7.8,153.2,122,271.2,289.1,353.6,499.2,29.5,75,40.4,157.4,58.6,236.6.3,1.4.6,2.7,1,4.1,11.3,90.6,11.1,183.7-.5,279Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1595.1,734.4c-29.2-55.7-70.4-104.3-120.1-142.2-71.7-54.8-161.1-87.4-257.9-87.6-235.7-.4-428.2,191.2-428.5,426.7-.4,216.6,161.4,396.7,370.3,424.7,18.4,2.5,37.2,3.8,56.3,3.8,45.2,0,88.8-6.9,129.7-19.9,172.8-54.8,298.6-216.5,298.9-406.8.1-71.7-17.5-139.3-48.7-198.7Z"
  }));
});

var SignLoginDialog = (function (props) {
  var _useContext = useContext(ErrorContext),
      setError = _useContext.setError;

  var _useContext2 = useContext(ConfigurationContext),
      message = _useContext2.message,
      endpoint = _useContext2.endpoint;

  var _useContext3 = useContext(ConfigurationContext),
      recoverSignature = _useContext3.recoverSignature;

  var _useContext4 = useContext(WalletContext),
      wallet = _useContext4.wallet,
      account = _useContext4.account;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loggingIn = _useState2[0],
      setLoggingIn = _useState2[1];

  if (!wallet) {
    return null;
  }

  wallet !== null && wallet !== void 0 && wallet.name ? wallet.name : 'wallet';
  var walletLogo = wallet !== null && wallet !== void 0 && wallet.logo ? wallet.logo : undefined;

  if (typeof recoverSignature != 'function') {
    recoverSignature = function recoverSignature(_ref) {
      var message = _ref.message,
          signature = _ref.signature;
      return new Promise(function (resolve, reject) {
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            signature: signature
          })
        }).then(function (response) {
          if (response.status == 200) {
            response.text().then(function (account) {
              resolve(account);
            })["catch"](setError);
          } else {
            response.text().then(function (text) {
              setError(text || 'Recovering login signature failed!');
            });
          }
        });
      });
    };
  }

  var login = function login() {
    setLoggingIn(true);
    var messageToSign;

    if (typeof message == 'function') {
      messageToSign = message(account);
    } else {
      messageToSign = message;
    }

    wallet.sign(messageToSign).then(function (signature) {
      recoverSignature({
        message: messageToSign,
        signature: signature,
        wallet: wallet
      }).then(function (account) {
        props.resolve({
          account: account,
          wallet: wallet
        });
        setLoggingIn(false);
      })["catch"](function (error) {
        setLoggingIn(false);
        setError(error);
      });
    })["catch"](function (error) {
      setLoggingIn(false);

      if (error && error.code && (error.code == 4001 || error.code == 'ACTION_REJECTED')) ; else {
        setError(error);
      }
    });
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, walletLogo && /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(LoginIcon, {
      className: "Graphic",
      width: "100px",
      height: "100px"
    })), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("p", {
      className: "FontSizeM PaddingLeftM PaddingRightM"
    }, "Click \"Log in\" and confirm in your wallet."))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, loggingIn && /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomS PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ActionIndicator MarginBottomXS"
    }, /*#__PURE__*/React.createElement("img", {
      src: wallet.logo
    }), /*#__PURE__*/React.createElement("div", {
      className: "ActionIndicatorSpinner"
    })), /*#__PURE__*/React.createElement("div", {
      className: "TextCenter PaddingTopXS"
    }, /*#__PURE__*/React.createElement("span", {
      className: "FontSizeL"
    }, "Confirm in your wallet")))), !loggingIn && /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: login
    }, "Log in"))
  });
});

var LoginStack = (function (props) {
  var _useContext = useContext(ClosableContext),
      open = _useContext.open,
      close = _useContext.close;

  return /*#__PURE__*/React.createElement(ReactDialogStack, {
    open: open,
    close: close,
    start: "SignLogin",
    stacked: props.stacked,
    container: props.container,
    document: props.document,
    dialogs: {
      SignLogin: /*#__PURE__*/React.createElement(SignLoginDialog, {
        resolve: props.resolve,
        userClosedDialog: props.userClosedDialog
      })
    }
  });
});

var WalletMissesBlockchainSupportDialog = (function (props) {
  var _useContext = useContext(NavigateStackContext);
      _useContext.navigate;

  var _useContext2 = useContext(ConfigurationContext),
      accept = _useContext2.accept;

  var _useContext3 = useContext(WalletContext),
      wallet = _useContext3.wallet;

  var blockchains = _toConsumableArray(new Set(accept.map(function (configuration) {
    return configuration.blockchain;
  }))).map(function (blockchainName) {
    return Blockchains[blockchainName];
  });

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://support.depay.com?wallet=".concat(encodeURIComponent(wallet === null || wallet === void 0 ? void 0 : wallet.name), "&blockchains=").concat(blockchains.map(function (blockchain) {
        return blockchain.name;
      }).join(','), "&query=").concat(encodeURIComponent("Wallet does not support blockchain")),
      target: "_blank",
      className: "Card secondary small inlineBlock"
    }, "Contact support")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(QuestionsGraphic, null)), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Missing Blockchain Support"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "The connected wallet doesn\u2019t support the blockchains needed to perform this payment.")), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please connect a different wallet that supports one of the available blockchains:"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomM"
    }, blockchains.map(function (blockchain) {
      return /*#__PURE__*/React.createElement("div", {
        key: blockchain.name,
        className: "Card tiny disabled inlineBlock MarginRightXS MarginBottomXS"
      }, /*#__PURE__*/React.createElement("img", {
        className: "BlockchainLogo small bottomRight " + blockchain.name,
        style: {
          backgroundColor: blockchain.logoBackgroundColor
        },
        src: blockchain.logo,
        alt: blockchain.label,
        title: blockchain.label
      }), /*#__PURE__*/React.createElement("span", {
        className: "PaddingLeftXS ResponsiveText FontWeightLight"
      }, blockchain.label));
    }))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: function onClick() {
        return props.disconnect();
      }
    }, "Connect another wallet"))
  });
});

var WalletProvider = (function (props) {
  var _useContext = useContext(ClosableContext),
      open = _useContext.open,
      close = _useContext.close;

  var _useContext2 = useContext(ConfigurationContext),
      accept = _useContext2.accept,
      passedWallet = _useContext2.wallet;

  var _useContext3 = useContext(UpdatableContext),
      setUpdatable = _useContext3.setUpdatable;

  var _useContext4 = useContext(ErrorContext);
      _useContext4.setError;

  var _useState = useState(passedWallet),
      _useState2 = _slicedToArray(_useState, 2),
      wallet = _useState2[0],
      setWallet = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      solanaPayWallet = _useState4[0],
      _setSolanaPayWallet = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      navigator = _useState6[0],
      setNavigator = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      walletMissesBlockchainSupport = _useState8[0],
      setWalletMissesBlockchainSupport = _useState8[1];

  var _useState9 = useState(),
      _useState10 = _slicedToArray(_useState9, 2),
      account = _useState10[0],
      setAccount = _useState10[1];

  var _useState11 = useState(false),
      _useState12 = _slicedToArray(_useState11, 2),
      navigationReturnsToConnect = _useState12[0],
      setNavigationReturnsToConnect = _useState12[1];

  var _useState13 = useState(passedWallet ? 'connected' : undefined),
      _useState14 = _slicedToArray(_useState13, 2),
      walletState = _useState14[0],
      setWalletState = _useState14[1];

  useCallback(debounce(function () {
    wallet.connect().then(setAccount);
  }));
  var debounceSetWalletMissesBlockchainSupport = useCallback(debounce(function (value) {
    setWalletMissesBlockchainSupport(value);
  }));

  var connected = function connected(_ref) {
    var account = _ref.account,
        wallet = _ref.wallet;
    navigator === null || navigator === void 0 ? void 0 : navigator.hide();
    setTimeout(function () {
      setAccount(account);
      setWallet(wallet);
      setNavigationReturnsToConnect(true);
      setWalletState('connected');

      if (props.connected) {
        props.connected(account);
      }
    }, 80);
  };

  var disconnect = function disconnect() {
    setAccount();
    setWallet();
    setWalletState();
    setWalletMissesBlockchainSupport(false);
  };

  useEffect(function () {
    if (!wallet) {
      return;
    }

    if (accept && !accept.some(function (configuration) {
      return wallet.blockchains.includes(configuration.blockchain);
    })) {
      setUpdatable(false);
      setTimeout(function () {
        return debounceSetWalletMissesBlockchainSupport(true);
      }, 200);
      return;
    }

    var onAccountChanged = function onAccountChanged(account) {
      if (account) {
        setAccount(account);
      } else {
        setAccount();
        setWalletState();
      }
    };

    wallet.on('account', onAccountChanged);
    return function () {
      wallet.off('account', onAccountChanged);
    };
  }, [wallet]);
  useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var _account;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!passedWallet) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return passedWallet.account();

            case 3:
              _account = _context.sent;

              if (_account) {
                setAccount(_account);
              } else {
                setWallet();
                setWalletState();
              }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, []);
  useEffect(function () {
    if (solanaPayWallet) {
      setWalletState('connected');
    }
  }, [solanaPayWallet]);

  if (walletMissesBlockchainSupport) {
    return /*#__PURE__*/React.createElement(WalletContext.Provider, {
      value: {
        account: account,
        wallet: wallet,
        disconnect: disconnect
      }
    }, /*#__PURE__*/React.createElement(ReactDialogStack, {
      open: open,
      close: close,
      start: "WalletMissesBlockchainSupport",
      container: props.container,
      document: props.document,
      stacked: true,
      dialogs: {
        WalletMissesBlockchainSupport: /*#__PURE__*/React.createElement(WalletMissesBlockchainSupportDialog, {
          disconnect: disconnect
        })
      }
    }));
  } else if (walletState == 'connected') {
    return /*#__PURE__*/React.createElement(WalletContext.Provider, {
      value: {
        account: account,
        wallet: wallet,
        disconnect: disconnect,
        solanaPayWallet: solanaPayWallet,
        setAccount: setAccount
      }
    }, props.children);
  } else {
    return /*#__PURE__*/React.createElement(ConnectStack, {
      setNavigator: setNavigator,
      document: props.document,
      container: props.container,
      resolve: connected,
      accept: accept,
      setSolanaPayWallet: function setSolanaPayWallet(value) {
        return _setSolanaPayWallet(value);
      },
      stacked: navigationReturnsToConnect ? 'backward' : undefined
    });
  }
});

var Login = function Login(options) {
  requireReactVersion();
  var style, error, document, message, endpoint, recover, wallet;

  if (_typeof(options) == 'object') {
    style = options.style;
    error = options.error;
    document = options.document;
    message = options.message;
    endpoint = options.endpoint;
    recover = options.recover;
    wallet = options.wallet;
  }

  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_resolve, reject) {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mount({
                style: style,
                document: ensureDocument(document)
              }, function (unmount) {
                var userClosedDialog = function userClosedDialog() {
                  reject('USER_CLOSED_DIALOG');
                  unmount();
                };

                return function (container) {
                  return /*#__PURE__*/React.createElement(ErrorProvider, {
                    errorCallback: error,
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React.createElement(ConfigurationProvider, {
                    configuration: {
                      message: message,
                      endpoint: endpoint || '/login',
                      recoverSignature: recover,
                      wallet: wallet
                    }
                  }, /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
                    unmount: userClosedDialog
                  }, /*#__PURE__*/React.createElement(PoweredBy, null), /*#__PURE__*/React.createElement(WalletProvider, {
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React.createElement(LoginStack, {
                    document: document,
                    container: container,
                    stacked: true,
                    resolve: function resolve(_ref2) {
                      var account = _ref2.account,
                          wallet = _ref2.wallet;
                      unmount();

                      _resolve({
                        account: account,
                        wallet: wallet
                      });
                    }
                  }))))));
                };
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var CallbackContext = /*#__PURE__*/React.createContext({
  accept: []
});

var CallbackProvider = (function (props) {
  var _useContext = useContext(ConfigurationContext),
      sent = _useContext.sent,
      succeeded = _useContext.succeeded,
      failed = _useContext.failed,
      validated = _useContext.validated;

  var sentCallbackCalled = useRef();
  var succeededCallbackCalled = useRef();
  var failedCallbackCalled = useRef();
  var validatedCallbackCalled = useRef();

  var callSentCallback = function callSentCallback(transaction, paymentRoute) {
    if (typeof sent === 'function' && sentCallbackCalled.current !== true) {
      sentCallbackCalled.current = true;
      setTimeout(function () {
        return sent(transaction, paymentRoute);
      }, 200);
    }
  };

  var callSucceededCallback = function callSucceededCallback(transaction, paymentRoute) {
    if (typeof succeeded === 'function' && succeededCallbackCalled.current !== true) {
      succeededCallbackCalled.current = true;
      setTimeout(function () {
        return succeeded(transaction, paymentRoute);
      }, 200);
    }
  };

  var callFailedCallback = function callFailedCallback(transaction, paymentRoute) {
    if (typeof failed === 'function' && failedCallbackCalled.current !== true) {
      failedCallbackCalled.current = true;
      setTimeout(function () {
        return failed(transaction, paymentRoute);
      }, 200);
    }
  };

  var callValidatedCallback = function callValidatedCallback(transaction, paymentRoute) {
    if (validated && validatedCallbackCalled.current !== true) {
      validatedCallbackCalled.current = true;
      setTimeout(function () {
        return validated(transaction, paymentRoute);
      }, 200);
    }
  };

  return /*#__PURE__*/React.createElement(CallbackContext.Provider, {
    value: {
      callSentCallback: callSentCallback,
      callSucceededCallback: callSucceededCallback,
      callFailedCallback: callFailedCallback,
      callValidatedCallback: callValidatedCallback
    }
  }, props.children);
});

var ChangableAmountContext = /*#__PURE__*/React.createContext();

var ConversionRateContext = /*#__PURE__*/React.createContext();

var round = (function (input) {
  var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'up';
  var decimalInput = new Decimal(input);
  var origDp = decimalInput.decimalPlaces(); // fixed representation of the input

  var inputStr = decimalInput.toFixed(origDp); // split into integer and fractional parts

  var _inputStr$split = inputStr.split('.'),
      _inputStr$split2 = _slicedToArray(_inputStr$split, 2);
      _inputStr$split2[0];
      var _inputStr$split2$ = _inputStr$split2[1],
      frac = _inputStr$split2$ === void 0 ? '' : _inputStr$split2$; // count leading zeros in fractional part when <1


  var zerosCount = decimalInput.gte(1) ? 0 : frac.match(/^0*/)[0].length; // threshold DP: 3 for >=1, zerosCount+3 for <1

  var thresholdDp = decimalInput.gte(1) ? 3 : zerosCount + 3; // if no rounding needed, return original (pad integers to two decimals)

  if (origDp <= thresholdDp) {
    if (origDp === 0) {
      return decimalInput.toFixed(2);
    }

    return inputStr;
  } // perform rounding


  var mode = direction === 'down' ? Decimal.ROUND_FLOOR : Decimal.ROUND_CEIL;
  var result = decimalInput.toDecimalPlaces(thresholdDp, mode);
  var resStr = result.toFixed(thresholdDp); // if rounding yields zero, fall back to original

  if (new Decimal(resStr).eq(0)) {
    return inputStr;
  } // trim or pad trailing zeros


  if (resStr.includes('.')) {
    var _resStr$split = resStr.split('.'),
        _resStr$split2 = _slicedToArray(_resStr$split, 2),
        iPart = _resStr$split2[0],
        fPart = _resStr$split2[1];

    if (/^0*$/.test(fPart)) {
      // fractional all zeros => decide padding on magnitude
      if (decimalInput.lt(1)) {
        fPart = '00';
      } else if (decimalInput.lt(10)) {
        fPart = '0';
      } else if (decimalInput.lt(100)) {
        fPart = '';
      } else if (decimalInput.lt(1000)) {
        fPart = '00';
      } else {
        fPart = ''.padEnd(thresholdDp, '0');
      }
    } else {
      // remove only trailing zeros
      fPart = fPart.replace(/0+$/, '');
    }

    resStr = fPart ? "".concat(iPart, ".").concat(fPart) : iPart;
  }

  return resStr;
});

var tokenAmountForUSD = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
    var blockchain, token, amount, response;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            blockchain = _ref.blockchain, token = _ref.token, amount = _ref.amount;

            if (!Blockchains[blockchain].stables.usd.includes(token)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", amount);

          case 3:
            _context.next = 5;
            return fetch("https://public.depay.com/conversions/".concat(blockchain, "/").concat(token, "/USD?amount=").concat(amount));

          case 5:
            response = _context.sent;

            if (!(response.status == 200)) {
              _context.next = 12;
              break;
            }

            _context.t0 = parseFloat;
            _context.next = 10;
            return response.text();

          case 10:
            _context.t1 = _context.sent;
            return _context.abrupt("return", (0, _context.t0)(_context.t1));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})();

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var ChangableAmountProvider = (function (props) {
  var configurationsMissAmounts = function configurationsMissAmounts(configurations) {
    return !configurations.every(function (configuration) {
      return typeof configuration.amount != 'undefined' || typeof configuration.fromAmount != 'undefined';
    });
  };

  var _useContext = useContext(ConfigurationContext),
      configuredAmount = _useContext.amount;
      _useContext.toAmount;
      var accept = _useContext.accept;

  useContext(ConfigurationContext);

  var _useState = useState(configurationsMissAmounts(accept)),
      _useState2 = _slicedToArray(_useState, 2),
      amountsMissing = _useState2[0],
      setAmountsMissing = _useState2[1];

  var _useContext2 = useContext(WalletContext),
      account = _useContext2.account;

  var _useContext3 = useContext(ConversionRateContext),
      conversionRate = _useContext3.conversionRate,
      fixedCurrencyConversionRate = _useContext3.fixedCurrencyConversionRate;

  var _useContext4 = useContext(ErrorContext),
      setError = _useContext4.setError;

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      acceptWithAmount = _useState4[0],
      setAcceptWithAmount = _useState4[1];

  var _useState5 = useState(_typeof(configuredAmount) == 'object' && configuredAmount.fix && configuredAmount.currency ? configuredAmount.fix : null),
      _useState6 = _slicedToArray(_useState5, 1),
      fixedAmount = _useState6[0];

  var _useState7 = useState(_typeof(configuredAmount) == 'object' && configuredAmount.fix && configuredAmount.currency ? configuredAmount.currency : null),
      _useState8 = _slicedToArray(_useState7, 1),
      fixedCurrency = _useState8[0];

  var startAmount;

  if (amountsMissing) {
    if (_typeof(configuredAmount) == "object" && configuredAmount.start && configuredAmount.start) {
      startAmount = configuredAmount.start;
    } else if (_typeof(configuredAmount) == "object" && configuredAmount.fix) {
      startAmount = configuredAmount.fix;
    } else {
      startAmount = 1;
    }
  }

  var _useState9 = useState(startAmount),
      _useState10 = _slicedToArray(_useState9, 2),
      amount = _useState10[0],
      setAmount = _useState10[1];

  useEffect(function () {
    setAmountsMissing(configurationsMissAmounts(accept));
  }, [accept]);

  var getAmounts = function getAmounts(_ref) {
    var amount = _ref.amount,
        conversionRate = _ref.conversionRate;
        _ref.fixedCurrencyConversionRate;

    if (configuredAmount && configuredAmount.token) {
      return Promise.resolve(accept.map(function () {
        return amount;
      }));
    } else {
      return Promise.all(accept.map(function (accept) {
        return tokenAmountForUSD({
          blockchain: accept.blockchain,
          token: accept.token,
          amount: amount * conversionRate
        });
      }));
    }
  };

  var updateAmounts = useCallback(debounce(function (_ref2) {
    _ref2.account;
        var amount = _ref2.amount,
        conversionRate = _ref2.conversionRate,
        fixedCurrencyConversionRate = _ref2.fixedCurrencyConversionRate;
    getAmounts({
      amount: amount,
      conversionRate: conversionRate,
      fixedCurrencyConversionRate: fixedCurrencyConversionRate
    }).then(function (amounts) {
      setAcceptWithAmount(accept.map(function (configuration, index) {
        if (amounts[index] == undefined) {
          return;
        }

        return _objectSpread$4(_objectSpread$4({}, configuration), {}, {
          amount: parseFloat(round(amounts[index]))
        });
      }).filter(function (configuration) {
        return !!configuration;
      }));
    })["catch"](setError);
  }, 500), []);
  useEffect(function () {
    if (amountsMissing && account && conversionRate && (fixedAmount ? fixedCurrencyConversionRate : true)) {
      setAcceptWithAmount();
      updateAmounts({
        account: account,
        amount: amount,
        conversionRate: conversionRate,
        fixedCurrencyConversionRate: fixedCurrencyConversionRate
      });
    }
  }, [amountsMissing, account, conversionRate, fixedAmount, fixedCurrencyConversionRate, amount]);
  return /*#__PURE__*/React.createElement(ChangableAmountContext.Provider, {
    value: {
      amountsMissing: amountsMissing,
      fixedAmount: fixedAmount,
      fixedCurrency: fixedCurrency,
      acceptWithAmount: acceptWithAmount,
      amount: amount,
      setAmount: setAmount
    }
  }, props.children);
});

var ConversionRateProvider = (function (props) {
  var _useContext = useContext(ErrorContext);
      _useContext.setError;

  var _useContext2 = useContext(ConfigurationContext),
      amount = _useContext2.amount,
      currency = _useContext2.currency;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      conversionRate = _useState2[0],
      setConversionRate = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      fixedCurrencyConversionRate = _useState4[0],
      setFixedCurrencyConversionRate = _useState4[1];

  useEffect(function () {
    if (_typeof(amount) == 'object' && amount.currency) {
      Currency.fromUSD({
        amount: 1,
        code: amount.currency
      }).then(function (conversion) {
        return setFixedCurrencyConversionRate(conversion.amount);
      });
    }

    Currency.fromUSD({
      amount: 1,
      code: currency
    }).then(function (conversion) {
      return setConversionRate(conversion.amount);
    })["catch"](setConversionRate(1));
  }, []);
  return /*#__PURE__*/React.createElement(ConversionRateContext.Provider, {
    value: {
      conversionRate: conversionRate,
      fixedCurrencyConversionRate: fixedCurrencyConversionRate
    }
  }, props.children);
});

var PaymentAmountRoutingContext = /*#__PURE__*/React.createContext();

var PaymentRoutingContext = /*#__PURE__*/React.createContext();

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var prepareAcceptedPayments = function prepareAcceptedPayments(accept, receiver) {
  var toAddress = receiver ? receiver : undefined;
  return _objectSpread$3(_objectSpread$3({}, accept), {}, {
    toAddress: toAddress
  });
};

var mergeFromAccounts = function mergeFromAccounts(accept, account) {
  var from = {};
  accept.forEach(function (accept) {
    from[accept.blockchain] = account;
  });
  return from;
};

var routePayments = (function (_ref) {
  var accept = _ref.accept,
      account = _ref.account,
      receiver = _ref.receiver,
      allow = _ref.allow,
      deny = _ref.deny,
      whitelist = _ref.whitelist,
      blacklist = _ref.blacklist,
      best = _ref.best;
  return route({
    accept: accept.map(function (accept) {
      return prepareAcceptedPayments(accept, receiver);
    }),
    from: mergeFromAccounts(accept, account),
    allow: allow || whitelist,
    deny: deny || blacklist,
    best: best
  });
});

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var RELOAD_PERIOD = 15000;
var PaymentRoutingProvider = (function (props) {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      allRoutes = _useState2[0],
      setAllRoutes = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      updatedRoutes = _useState4[0],
      setUpdatedRoutes = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      updatedRouteWithNewPrice = _useState6[0],
      setUpdatedRouteWithNewPrice = _useState6[1];

  var _useState7 = useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      selectedRoute = _useState8[0],
      setSelectedRoute = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      slowRouting = _useState10[0],
      setSlowRouting = _useState10[1];

  var _useState11 = useState(0),
      _useState12 = _slicedToArray(_useState11, 2),
      reloadCount = _useState12[0],
      setReloadCount = _useState12[1];

  var _useState13 = useState(false),
      _useState14 = _slicedToArray(_useState13, 2),
      allRoutesLoaded = _useState14[0],
      setAllRoutesLoaded = _useState14[1];

  var _useContext = useContext(WalletContext),
      account = _useContext.account;
      _useContext.wallet;
      var solanaPayWallet = _useContext.solanaPayWallet;

  var _useContext2 = useContext(UpdatableContext),
      updatable = _useContext2.updatable;

  var configuration = useContext(ConfigurationContext);

  var _useContext3 = useContext(ChangableAmountContext);
      _useContext3.amountsMissing;

  var _useContext4 = useContext(ErrorContext),
      setError = _useContext4.setError;

  var getPaymentRoutes = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
      var selectedRoute, updatable, slowRoutingTimeout;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              selectedRoute = _ref.selectedRoute, updatable = _ref.updatable;

              if (!(updatable == false || !props.accept || !account)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              slowRoutingTimeout = setTimeout(function () {
                setSlowRouting(true);
              }, 3000);
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                routePayments(Object.assign({}, configuration, {
                  accept: props.accept,
                  account: account,
                  best: function best(route) {
                    if (route && !selectedRoute) {
                      roundAmounts([route]).then(function (routes) {
                        setSelectedRoute(routes[0]);
                        clearInterval(slowRoutingTimeout);
                      });
                    }
                  }
                })).then(function (routes) {
                  setUpdatedRoutes(routes);
                  clearInterval(slowRoutingTimeout);
                  resolve();
                })["catch"](function (error) {
                  setError(error);
                  resolve();
                });
              }));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getPaymentRoutes(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var updateRouteAmount = function updateRouteAmount(route, amountBN) {
    route.fromAmount = amountBN.toString();
  };

  var roundAmount = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(route, amountBN) {
      var readableAmount, roundedAmountBN;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!route.directTransfer) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", route);

            case 2:
              _context2.next = 4;
              return route.fromToken.readable(amountBN || route.fromAmount);

            case 4:
              readableAmount = _context2.sent;

              if (!(round(readableAmount) === 0)) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return", route);

            case 7:
              _context2.next = 9;
              return route.fromToken.BigNumber(round(readableAmount));

            case 9:
              roundedAmountBN = _context2.sent;
              updateRouteAmount(route, roundedAmountBN);
              return _context2.abrupt("return", route);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function roundAmount(_x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var roundAmounts = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(routes) {
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", Promise.all(routes.map(function (route) {
                return roundAmount(route);
              })));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function roundAmounts(_x4) {
      return _ref4.apply(this, arguments);
    };
  }();

  var updateRouteWithNewPrice = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4() {
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              setSelectedRoute(_objectSpread$2({}, updatedRouteWithNewPrice));
              setUpdatedRouteWithNewPrice(null);

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function updateRouteWithNewPrice() {
      return _ref5.apply(this, arguments);
    };
  }();

  var refreshPaymentRoutes = function refreshPaymentRoutes() {
    return getPaymentRoutes({
      allRoutes: allRoutes,
      selectedRoute: undefined,
      updatable: updatable
    });
  };

  useEffect(function () {
    var timeout = setTimeout(function () {
      if (allRoutesLoaded) {
        // do not reload if first routes have not been loaded yet
        setReloadCount(reloadCount + 1);
        getPaymentRoutes({
          allRoutes: allRoutes,
          selectedRoute: selectedRoute,
          updatable: updatable
        });
      }
    }, RELOAD_PERIOD);
    return function () {
      return clearTimeout(timeout);
    };
  }, [reloadCount, allRoutes, allRoutesLoaded, selectedRoute, updatable]);
  useEffect(function () {
    if (account && props.accept && !solanaPayWallet) {
      refreshPaymentRoutes();
    } else if (props.accept === undefined) {
      setSelectedRoute();
      setAllRoutesLoaded(false);
      setUpdatedRoutes();
      setAllRoutes();
    }
  }, [account, solanaPayWallet, props.accept]);
  var updateAllRoutes = useCallback(debounce(function (selectedRoute, updatedRoutes) {
    if (updatedRoutes === undefined) {
      return;
    }

    if (updatedRoutes.length == 0) {
      setAllRoutes(updatedRoutes);
    } else {
      roundAmounts(updatedRoutes).then(function (roundedRoutes) {
        if (typeof selectedRoute == 'undefined') {
          var selectRoute = roundedRoutes[0];
          setSelectedRoute(selectRoute);
        } else {
          var updatedSelectedRoute = roundedRoutes[roundedRoutes.findIndex(function (route) {
            return route.fromToken.address == selectedRoute.fromToken.address && route.blockchain == selectedRoute.blockchain;
          })];

          if (updatedSelectedRoute) {
            if (selectedRoute.fromAmount != updatedSelectedRoute.fromAmount) {
              setUpdatedRouteWithNewPrice(updatedSelectedRoute);
            }
          } else {
            setSelectedRoute(roundedRoutes[0]);
          }
        }

        roundedRoutes.assets = updatedRoutes.assets;
        setAllRoutes(roundedRoutes);
        setAllRoutesLoaded(true);
      });
    }
  }, 500), []);
  useEffect(function () {
    updateAllRoutes(selectedRoute, updatedRoutes);
  }, [selectedRoute, updatedRoutes]);
  return /*#__PURE__*/React.createElement(PaymentRoutingContext.Provider, {
    value: {
      selectedRoute: selectedRoute,
      setSelectedRoute: setSelectedRoute,
      refreshPaymentRoutes: refreshPaymentRoutes,
      allRoutes: allRoutes,
      allRoutesLoaded: allRoutesLoaded,
      slowRouting: slowRouting,
      updatedRouteWithNewPrice: updatedRouteWithNewPrice,
      updateRouteWithNewPrice: updateRouteWithNewPrice
    }
  }, props.children);
});

var PaymentAmountRoutingProvider = (function (props) {
  var _useContext = useContext(ChangableAmountContext),
      amountsMissing = _useContext.amountsMissing,
      acceptWithAmount = _useContext.acceptWithAmount;

  var _useContext2 = useContext(ConfigurationContext),
      configuredAccept = _useContext2.accept;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      accept = _useState2[0],
      setAccept = _useState2[1];

  useEffect(function () {
    if (amountsMissing) {
      setAccept(acceptWithAmount);
    } else {
      setAccept(configuredAccept);
    }
  }, [amountsMissing, acceptWithAmount]);
  return /*#__PURE__*/React.createElement(PaymentAmountRoutingContext.Provider, {
    value: {}
  }, /*#__PURE__*/React.createElement(PaymentRoutingProvider, {
    accept: accept,
    container: props.container,
    document: props.document
  }, props.children));
});

function addressEllipsis (address) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (address === undefined) {
    return address;
  }

  var _address = "";
  _address += address.slice(0, length + 2);
  _address += '...';
  _address += address.slice(address.length - length, address.length);
  return _address;
}

var NoPaymentOptionFoundDialog = (function () {
  var _useContext = useContext(ConfigurationContext),
      accept = _useContext.accept;

  var _useContext2 = useContext(ClosableContext),
      close = _useContext2.close;

  var _useContext3 = useContext(WalletContext),
      wallet = _useContext3.wallet;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      walletAddress = _useState2[0],
      setWalletAddress = _useState2[1];

  useEffect(function () {
    wallet.account().then(setWalletAddress);
  }, [wallet]);
  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://support.depay.com?account=".concat(walletAddress, "&wallet=").concat(wallet === null || wallet === void 0 ? void 0 : wallet.name, "&query=").concat(encodeURIComponent("Not enough funds available")),
      target: "_blank",
      className: "Card secondary small inlineBlock"
    }, "Contact support")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(QuestionsGraphic, null)), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopXS FontWeightBold"
    }, "Not Enough Funds"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomXS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please check that you have sufficient funds on one of these blockchains:")), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopXS PaddingBottomS PaddingLeftM PaddingRightM"
    }, _toConsumableArray(new Set(accept.map(function (accept) {
      return accept.blockchain;
    }))).map(function (blockchain) {
      return /*#__PURE__*/React.createElement("div", {
        key: blockchain,
        className: "Card tiny disabled inlineBlock MarginRightXS MarginBottomXS"
      }, /*#__PURE__*/React.createElement("img", {
        className: "BlockchainLogo small bottomRight " + Blockchains[blockchain].name,
        style: {
          backgroundColor: Blockchains[blockchain].logoBackgroundColor
        },
        src: Blockchains[blockchain].logo,
        alt: Blockchains[blockchain].label,
        title: Blockchains[blockchain].label
      }), /*#__PURE__*/React.createElement("span", {
        className: "PaddingLeftXS ResponsiveText FontWeightLight"
      }, Blockchains[blockchain].label));
    })), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingBottomXS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Card tiny disabled transparent center Opacity03"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ResponsiveText FontWeightLight TextCenter"
    }, walletAddress))))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: close
    }, "Ok"))
  });
});

var PaymentContext = /*#__PURE__*/React.createContext();

var PaymentTrackingContext = /*#__PURE__*/React.createContext();

var PaymentProvider = (function (props) {
  var _useContext = useContext(ErrorContext),
      setError = _useContext.setError;

  var _useContext2 = useContext(CallbackContext),
      callSentCallback = _useContext2.callSentCallback,
      callSucceededCallback = _useContext2.callSucceededCallback,
      callFailedCallback = _useContext2.callFailedCallback;

  var _useContext3 = useContext(PaymentTrackingContext);
      _useContext3.transaction;
      var setTransaction = _useContext3.setTransaction;

  var _useContext4 = useContext(ConfigurationContext);
      _useContext4.accept;
      var before = _useContext4.before;

  var _useContext5 = useContext(PaymentRoutingContext),
      allRoutes = _useContext5.allRoutes;
      _useContext5.allAssets;
      var selectedRoute = _useContext5.selectedRoute,
      refreshPaymentRoutes = _useContext5.refreshPaymentRoutes;

  var _useContext6 = useContext(ClosableContext),
      open = _useContext6.open,
      close = _useContext6.close,
      setClosable = _useContext6.setClosable;

  var _useContext7 = useContext(UpdatableContext),
      setUpdatable = _useContext7.setUpdatable;

  var _useContext8 = useContext(NavigateContext),
      navigate = _useContext8.navigate,
      set = _useContext8.set;

  var _useContext9 = useContext(WalletContext),
      wallet = _useContext9.wallet;
      _useContext9.account;

  var _useContext10 = useContext(PaymentTrackingContext),
      release = _useContext10.release,
      synchronousTracking = _useContext10.synchronousTracking,
      asynchronousTracking = _useContext10.asynchronousTracking,
      trackingInitialized = _useContext10.trackingInitialized,
      track = _useContext10.track,
      trace = _useContext10.trace;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      payment = _useState2[0],
      setPayment = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      approvalTransaction = _useState4[0],
      setApprovalTransaction = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      approvalSignature = _useState6[0],
      setApprovalSignature = _useState6[1];

  var _useState7 = useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      approvalSignatureData = _useState8[0],
      setApprovalSignatureData = _useState8[1];

  var _useState9 = useState(),
      _useState10 = _slicedToArray(_useState9, 2),
      resetApprovalTransaction = _useState10[0],
      setResetApprovalTransaction = _useState10[1];

  var _useState11 = useState('initialized'),
      _useState12 = _slicedToArray(_useState11, 2),
      paymentState = _useState12[0],
      setPaymentState = _useState12[1];

  var _useState13 = useState('transaction'),
      _useState14 = _slicedToArray(_useState13, 2),
      approvalType = _useState14[0],
      setApprovalType = _useState14[1];

  var _useState15 = useState('max'),
      _useState16 = _slicedToArray(_useState15, 2),
      approvalAmount = _useState16[0],
      setApprovalAmount = _useState16[1];

  var paymentSucceeded = useEvent(function (transaction, payment) {
    if (synchronousTracking == false) {
      setClosable(true);
      setPaymentState('success');
    } else if (release != true && paymentState != 'success') {
      setPaymentState('validating');
    }

    callSucceededCallback(transaction, selectedRoute);
  });
  var paymentFailed = useEvent(function (transaction, error) {
    if (asynchronousTracking == false || trackingInitialized == true) {
      setClosable(true);
    }

    set(['PaymentFailed']);
    setPaymentState('failed');
    callFailedCallback(transaction, selectedRoute);
  });
  var pay = useEvent( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(passedSignatureData, passedSignature) {
      var _transaction$params, _transaction$params$p;

      var transaction, stop, currentBlock, deadline;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              setPaymentState('paying');
              setUpdatable(false);
              _context2.next = 4;
              return wallet.account();

            case 4:
              _context2.next = 7;
              return payment.route.getTransaction(Object.assign({
                wallet: wallet
              }, approvalSignatureData || passedSignatureData ? {
                signature: approvalSignature || passedSignature,
                signatureNonce: (approvalSignatureData || passedSignatureData).message.nonce,
                signatureDeadline: (approvalSignatureData || passedSignatureData).message.deadline
              } : {}));

            case 7:
              transaction = _context2.sent;

              if (!before) {
                _context2.next = 15;
                break;
              }

              _context2.next = 11;
              return before(transaction, selectedRoute);

            case 11:
              stop = _context2.sent;

              if (!(stop === false)) {
                _context2.next = 15;
                break;
              }

              setPaymentState('initialized');
              return _context2.abrupt("return");

            case 15:
              _context2.next = 17;
              return request({
                blockchain: transaction.blockchain,
                method: 'latestBlockNumber'
              });

            case 17:
              currentBlock = _context2.sent;
              deadline = transaction.deadline || (transaction === null || transaction === void 0 ? void 0 : (_transaction$params = transaction.params) === null || _transaction$params === void 0 ? void 0 : (_transaction$params$p = _transaction$params.payment) === null || _transaction$params$p === void 0 ? void 0 : _transaction$params$p.deadline);
              _context2.next = 21;
              return trace(currentBlock, payment.route, deadline).then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
                return regenerator.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        setClosable(false);

                        if (!window._depayWidgetError) {
                          _context.next = 3;
                          break;
                        }

                        return _context.abrupt("return");

                      case 3:
                        _context.next = 5;
                        return wallet.sendTransaction(Object.assign({}, transaction, {
                          accepted: function accepted() {
                            setPaymentState('sending');
                            setTransaction(transaction); // to hide sign CTA and verify link
                          },
                          sent: function sent(sentTransaction) {
                            setPaymentState('sending');
                            setTransaction(sentTransaction);
                            callSentCallback(sentTransaction, selectedRoute);
                          },
                          succeeded: function succeeded(transaction) {
                            return paymentSucceeded(transaction, payment);
                          },
                          failed: function failed(transaction, error) {
                            return paymentFailed(transaction, error, payment);
                          }
                        })).then(function (sentTransaction) {
                          setTransaction(sentTransaction);
                          track(sentTransaction, currentBlock, payment.route, deadline);
                        })["catch"](function (error) {
                          console.log('error', error);
                          setClosable(true);
                          setUpdatable(true);

                          if (approvalTransaction || approvalSignature || passedSignature) {
                            setPaymentState('approved');
                          } else {
                            setPaymentState('initialized');
                          }

                          if ((error === null || error === void 0 ? void 0 : error.code) == 'WRONG_NETWORK' || (error === null || error === void 0 ? void 0 : error.code) == 'NOT_SUPPORTED') {
                            navigate('WrongNetwork');
                          }
                        });

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              })))["catch"](function (e) {
                console.log(e);
                setPaymentState('initialized');
                setClosable(true);
                setUpdatable(true);
                navigate('TracingFailed');
              });

            case 21:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
  var resetApproval = useEvent( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
    var resetApprovalTransaction;
    return regenerator.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            setPaymentState('resetting');
            setClosable(false);
            setUpdatable(false);
            _context3.t0 = JSON;
            _context3.t1 = JSON;
            _context3.next = 7;
            return payment.route.getRouterApprovalTransaction();

          case 7:
            _context3.t2 = _context3.sent;
            _context3.t3 = _context3.t1.stringify.call(_context3.t1, _context3.t2);
            resetApprovalTransaction = _context3.t0.parse.call(_context3.t0, _context3.t3);
            resetApprovalTransaction.params[1] = '0'; // reset first

            if (!window._depayWidgetError) {
              _context3.next = 13;
              break;
            }

            return _context3.abrupt("return");

          case 13:
            // do not perform any transaction if there was an error in the widget!
            wallet.sendTransaction(Object.assign({}, resetApprovalTransaction, {
              sent: function sent(sentTransaction) {
                setResetApprovalTransaction(sentTransaction);
              },
              succeeded: function succeeded() {
                setUpdatable(true);
                setClosable(true);
                refreshPaymentRoutes().then(function () {
                  setTimeout(function () {
                    setPaymentState('initialized');
                  }, 1000);
                });
              },
              failed: function failed(transaction, error) {
                setPaymentState('initialized');
                setClosable(true);
              }
            }))["catch"](function (error) {
              console.log('error', error);

              if ((error === null || error === void 0 ? void 0 : error.code) == 'WRONG_NETWORK' || (error === null || error === void 0 ? void 0 : error.code) == 'NOT_SUPPORTED') {
                navigate('WrongNetwork');
              }

              setPaymentState('initialized');
              setClosable(true);
            });

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  var approve = useEvent( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(performSignature) {
      var approvalTransaction, approvalSignatureData;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              setPaymentState('approve');
              setClosable(false);
              setUpdatable(false);

              if (!(approvalType == 'signature')) {
                _context4.next = 16;
                break;
              }

              if (!(performSignature || payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gte(payment.route.fromAmount))) {
                _context4.next = 11;
                break;
              }

              _context4.next = 7;
              return payment.route.getPermit2ApprovalSignature();

            case 7:
              approvalSignatureData = _context4.sent;
              setApprovalSignatureData(approvalSignatureData);
              _context4.next = 14;
              break;

            case 11:
              _context4.next = 13;
              return payment.route.getPermit2ApprovalTransaction();

            case 13:
              approvalTransaction = _context4.sent;

            case 14:
              _context4.next = 19;
              break;

            case 16:
              _context4.next = 18;
              return payment.route.getRouterApprovalTransaction(approvalAmount == 'min' ? {
                amount: payment.route.fromAmount
              } : undefined);

            case 18:
              approvalTransaction = _context4.sent;

            case 19:
              if (!approvalSignatureData) {
                _context4.next = 23;
                break;
              }

              wallet.sign(approvalSignatureData).then(function (signature) {
                setApprovalSignature(signature);
                setPaymentState('approved');
                setClosable(true);

                if (!isMobile()) {
                  pay(approvalSignatureData, signature);
                }
              })["catch"](function (e) {
                console.log('ERROR', e);
                setPaymentState('initialized');
                setClosable(true);
              });
              _context4.next = 27;
              break;

            case 23:
              if (!approvalTransaction) {
                _context4.next = 27;
                break;
              }

              if (!window._depayWidgetError) {
                _context4.next = 26;
                break;
              }

              return _context4.abrupt("return");

            case 26:
              // do not perform any transaction if there was an error in the widget!
              wallet.sendTransaction(Object.assign({}, approvalTransaction, {
                accepted: function accepted() {
                  setPaymentState('approving');
                },
                sent: function sent(sentTransaction) {
                  setPaymentState('approving');
                  setApprovalTransaction(sentTransaction);
                },
                succeeded: function succeeded() {
                  setUpdatable(true);
                  setClosable(true);

                  if (approvalType == 'signature') {
                    setPaymentState('approve'); // signature still requires signature approval

                    if (!isMobile()) {
                      approve(true);
                    }
                  } else {
                    setPaymentState('approved'); // transaction made it fully approved

                    if (!isMobile()) {
                      pay();
                    }
                  }
                }
              }))["catch"](function (error) {
                console.log('error', error);

                if ((error === null || error === void 0 ? void 0 : error.code) == 'WRONG_NETWORK' || (error === null || error === void 0 ? void 0 : error.code) == 'NOT_SUPPORTED') {
                  navigate('WrongNetwork');
                }

                setPaymentState('initialized');
                setClosable(true);
              });

            case 27:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
  useEffect(function () {
    if (payment && payment.route && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gt(ethers.BigNumber.from('0'))) {
      setApprovalType('signature');
    }
  }, [payment]);
  useEffect(function () {
    if (release) {
      setPaymentState('success');
    }
  }, [release]);
  useEffect(function () {
    if (asynchronousTracking && trackingInitialized && (paymentState == 'success' || paymentState == 'failed')) {
      setClosable(true);
    }
  }, [trackingInitialized, paymentState]);
  var debouncedSetPayment = useCallback(debounce(function (selectedRoute) {
    if (selectedRoute) {
      // reset approval status if selectedRoute has been changed
      setApprovalTransaction();
      setApprovalSignature();
      setApprovalSignatureData();
      var fromToken = new Token({
        blockchain: selectedRoute.blockchain,
        address: selectedRoute.fromToken.address
      });
      Promise.all([fromToken.name(), fromToken.symbol(), fromToken.readable(selectedRoute.fromAmount)]).then(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 3),
            name = _ref6[0],
            symbol = _ref6[1],
            amount = _ref6[2];

        setPayment({
          blockchain: Blockchains[selectedRoute.blockchain],
          route: selectedRoute,
          token: fromToken.address,
          name: name,
          symbol: symbol.toUpperCase(),
          amount: amount
        });
      })["catch"](setError);
    }
  }, 100), []);
  useEffect(function () {
    debouncedSetPayment(selectedRoute);
  }, [selectedRoute]);
  useEffect(function () {
    if (allRoutes && allRoutes.length == 0) {
      setUpdatable(false);
    } else if (allRoutes && allRoutes.length > 0) {
      setUpdatable(true);
    }
  }, [allRoutes]);

  if (allRoutes instanceof Array && allRoutes.length == 0) {
    return /*#__PURE__*/React.createElement(ReactDialogStack, {
      open: open,
      close: close,
      start: 'NoPaymentOptionFound',
      container: props.container,
      document: props.document,
      dialogs: {
        NoPaymentOptionFound: /*#__PURE__*/React.createElement(NoPaymentOptionFoundDialog, null)
      }
    });
  } else {
    return /*#__PURE__*/React.createElement(PaymentContext.Provider, {
      value: {
        payment: payment,
        paymentState: paymentState,
        pay: pay,
        approvalType: approvalType,
        setApprovalType: setApprovalType,
        approvalAmount: approvalAmount,
        setApprovalAmount: setApprovalAmount,
        approve: approve,
        resetApproval: resetApproval,
        approvalTransaction: approvalTransaction,
        approvalSignature: approvalSignature,
        resetApprovalTransaction: resetApprovalTransaction
      }
    }, props.children);
  }
});

function toNonExponential(num) {
  var str = num.toString();

  if (str.includes('e')) {
    var _str$split = str.split('e'),
        _str$split2 = _slicedToArray(_str$split, 2),
        base = _str$split2[0],
        expStr = _str$split2[1];

    var exponent = Number(expStr);

    var _base$split = base.split('.'),
        _base$split2 = _slicedToArray(_base$split, 2);
        _base$split2[0];
        var _base$split2$ = _base$split2[1],
        fracPart = _base$split2$ === void 0 ? '' : _base$split2$;

    var decimals = exponent < 0 ? fracPart.length + Math.abs(exponent) : Math.max(0, fracPart.length - exponent);
    str = num.toFixed(decimals);
  }

  return str;
}

function format(input) {
  var num = Number(input);

  if (isNaN(num)) {
    // non-numeric input: return as-is
    return String(input);
  }

  var s = toNonExponential(num); // split integer and fractional parts

  var _s$split = s.split('.'),
      _s$split2 = _slicedToArray(_s$split, 2);
      _s$split2[0];
      var fracPart = _s$split2[1]; // don't add separators for numbers below 1 (including negatives between -1 and 1)


  if (Math.abs(num) < 1) {
    return s;
  } // format integer part with grouping


  var formattedInt = new Intl.NumberFormat().format(Math.trunc(num)); // reattach fractional part if present

  return fracPart !== undefined && fracPart.length > 0 ? "".concat(formattedInt, ".").concat(fracPart) : formattedInt;
}

var PaymentValueContext = /*#__PURE__*/React.createContext();

var ChangeAmountDialog = (function (props) {
  var _useContext = useContext(NavigateStackContext),
      navigate = _useContext.navigate;

  var _useContext2 = useContext(ErrorContext);
      _useContext2.setError;

  var _useContext3 = useContext(WalletContext);
      _useContext3.account;

  var _useContext4 = useContext(ChangableAmountContext),
      amount = _useContext4.amount,
      setAmount = _useContext4.setAmount;

  var _useContext5 = useContext(PaymentValueContext);
      _useContext5.displayedPaymentValue;

  var _useState = useState(amount),
      _useState2 = _slicedToArray(_useState, 2),
      inputAmount = _useState2[0],
      setInputAmount = _useState2[1];

  var _useContext6 = useContext(ConfigurationContext),
      currencyCode = _useContext6.currencyCode,
      amountConfiguration = _useContext6.amount;

  var _useContext7 = useContext(PaymentRoutingContext);
      _useContext7.allRoutes;
      var setSelectedRoute = _useContext7.setSelectedRoute;

  var min = _typeof(amountConfiguration) == "object" && amountConfiguration.min ? amountConfiguration.min : 1;
  var step = _typeof(amountConfiguration) == "object" && amountConfiguration.step ? amountConfiguration.step : 1;
  var displayedCurrencyCode = amountConfiguration != undefined && amountConfiguration.token ? null : currencyCode;

  var changeAmountAndGoBack = function changeAmountAndGoBack() {
    var newAmount = toValidValue(parseFloat(inputAmount));

    if (newAmount != amount) {
      setSelectedRoute(undefined);
      setAmount(newAmount);
    }

    navigate('back');
  };

  var changeAmount = function changeAmount(value) {
    if (Number.isNaN(value)) {
      return;
    }

    setInputAmount(value);
  };

  var toValidStep = function toValidStep(value) {
    if (step) {
      value = parseFloat(new Decimal(Math.floor(new Decimal(value).div(step))).mul(step).toString());
    }

    return value;
  };

  var toValidValue = function toValidValue(value) {
    value = toValidStep(value);
    value = Math.max(min, value);
    value = toValidStep(value);
    return value;
  };

  var setValidValue = function setValidValue(value) {
    setInputAmount(toValidValue(value));
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL TextCenter"
    }, "Change Amount"), /*#__PURE__*/React.createElement("div", {
      className: "FontSizeL TextCenter FontWeightBold"
    }, /*#__PURE__*/React.createElement("strong", null, displayedCurrencyCode))),
    body: /*#__PURE__*/React.createElement("div", {
      className: "MaxHeight PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS TextCenter PaddingBottomL"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomM"
    }, /*#__PURE__*/React.createElement("input", {
      min: min,
      step: step,
      className: "Input FontSizeXXL TextAlignCenter",
      type: "number",
      name: "amount",
      value: parseFloat(inputAmount),
      onChange: function onChange(event) {
        changeAmount(event.target.value);
      },
      onBlur: function onBlur(event) {
        setValidValue(event.target.value);
      }
    }))))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: changeAmountAndGoBack
    }, "Done"))
  });
});

var ChangeApprovalDialog = (function (props) {
  var _useContext = useContext(PaymentContext),
      approvalType = _useContext.approvalType,
      setApprovalType = _useContext.setApprovalType,
      approvalAmount = _useContext.approvalAmount,
      setApprovalAmount = _useContext.setApprovalAmount;

  var _useContext2 = useContext(NavigateStackContext),
      navigate = _useContext2.navigate;

  var _useState = useState(approvalType),
      _useState2 = _slicedToArray(_useState, 2),
      dialogType = _useState2[0],
      setDialogType = _useState2[1];

  var _useState3 = useState(approvalAmount),
      _useState4 = _slicedToArray(_useState3, 2),
      dialogAmount = _useState4[0],
      setDialogAmount = _useState4[1];

  var saveAndGoBack = function saveAndGoBack() {
    setApprovalType(dialogType);
    setApprovalAmount(dialogAmount);
    navigate('back');
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL TextCenter"
    }, "Change Approval")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "MaxHeight PaddingTopXS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingLeftS PaddingBottomS"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "fontSizeM PaddingBottomXS MarginBottomXS"
    }, "Type"), /*#__PURE__*/React.createElement("label", {
      className: "Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "approvalType",
      value: "transaction",
      checked: dialogType === 'transaction',
      onChange: function onChange(event) {
        return setDialogType(event.target.value);
      }
    }), /*#__PURE__*/React.createElement("span", null, " Transaction")), /*#__PURE__*/React.createElement("label", {
      className: "Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "approvalType",
      value: "signature",
      checked: dialogType === 'signature',
      onChange: function onChange(event) {
        return setDialogType(event.target.value);
      }
    }), /*#__PURE__*/React.createElement("span", null, " Signature"))), dialogType == 'transaction' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
      className: "MarginBottomXS"
    }), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomS PaddingLeftS"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "fontSizeM PaddingBottomXS MarginBottomXS MarginTopXS"
    }, "Amount"), /*#__PURE__*/React.createElement("label", {
      className: "Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "approvalAmount",
      value: "max",
      checked: dialogAmount === 'max',
      onChange: function onChange(event) {
        return setDialogAmount(event.target.value);
      }
    }), /*#__PURE__*/React.createElement("span", null, " Maximum")), /*#__PURE__*/React.createElement("label", {
      className: "Radio PaddingTopXS PaddingRightS PaddingBottomXS PaddingLeftS"
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "approvalAmount",
      value: "min",
      checked: dialogAmount === 'min',
      onChange: function onChange(event) {
        return setDialogAmount(event.target.value);
      }
    }), /*#__PURE__*/React.createElement("span", null, " Minimum"))))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: saveAndGoBack
    }, "Save and return"))
  });
});

var ChangePaymentSkeleton = (function (props) {
  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL TextCenter"
    }, "Payment options")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "MaxHeight PaddingTopXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })), /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })), /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TextCenter Opacity05 PaddingTopS PaddingBottomS"
    }, /*#__PURE__*/React.createElement("strong", null, "Loading all payment options...")))
  });
});

var ChangePaymentDialog = (function (props) {
  var _useContext = useContext(ErrorContext),
      setError = _useContext.setError;

  var _useContext2 = useContext(PaymentRoutingContext),
      allRoutes = _useContext2.allRoutes,
      allRoutesLoaded = _useContext2.allRoutesLoaded,
      setSelectedRoute = _useContext2.setSelectedRoute;

  var _useContext3 = useContext(NavigateStackContext),
      navigate = _useContext3.navigate;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      allBestPaymentOptions = _useState2[0],
      setBestPaymentOptions = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      allMajorPaymentOptions = _useState4[0],
      setMajorPaymentOptions = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      allNativePaymentOptions = _useState6[0],
      setNativePaymentOptions = _useState6[1];

  var _useState7 = useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      allStablePaymentOptions = _useState8[0],
      setStablePaymentOptions = _useState8[1];

  var _useState9 = useState(),
      _useState10 = _slicedToArray(_useState9, 2),
      allPaymentOptions = _useState10[0],
      setAllPaymentOptions = _useState10[1];

  var _useState11 = useState(),
      _useState12 = _slicedToArray(_useState11, 2),
      selectedPaymentOptions = _useState12[0],
      setSelectedPaymentOptions = _useState12[1];

  var _useState13 = useState(),
      _useState14 = _slicedToArray(_useState13, 2),
      selectedTab = _useState14[0],
      setSelectedTab = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2);
      _useState16[0];
      _useState16[1];

  var _useState17 = useState(''),
      _useState18 = _slicedToArray(_useState17, 2),
      searchTerm = _useState18[0],
      setSearchTerm = _useState18[1];

  var _useState19 = useState(),
      _useState20 = _slicedToArray(_useState19, 2),
      fuse = _useState20[0],
      setFuse = _useState20[1];

  var _useState21 = useState(false),
      _useState22 = _slicedToArray(_useState21, 2),
      listScrolled = _useState22[0],
      setListScrolled = _useState22[1];

  var _useState23 = useState(true),
      _useState24 = _slicedToArray(_useState23, 2);
      _useState24[0];
      _useState24[1];

  var throttledSetListScrolled = useCallback(throttle(function (value) {
    return setListScrolled(value);
  }, 1000), []);

  var handleOnScroll = function handleOnScroll(event) {
    if (!listScrolled) {
      throttledSetListScrolled(true);
    }

    if (event.target.scrollTop <= 0 && selectedPaymentOptions.length > 9) {
      throttledSetListScrolled(false);
    }
  };

  var searchPaymentOption = useCallback(debounce(function (term, fuse, allPaymentOptions) {
    if (term.length == 0) {
      setSelectedPaymentOptions(allPaymentOptions);
    } else {
      var results = fuse.search(term);
      setSelectedPaymentOptions(results.map(function (result) {
        return result.item;
      }));
    }

    listElement.current.scrollTop = 0;
  }, 300), []);

  var onChangeSearch = function onChangeSearch(event, fuse, allPaymentOptions) {
    setSearchTerm(event.target.value);
    searchPaymentOption(event.target.value, fuse, allPaymentOptions);
  };

  var listElement = useRef();
  var searchElement = useRef();
  useEffect(function () {
    if (allRoutes == undefined) {
      return;
    }

    if (allRoutesLoaded !== true) {
      return;
    }

    Promise.all(allRoutes.map(function (route) {
      route.exchangeRoutes[0];
      route.fromToken;
      return Promise.all([route.fromToken.name(), route.fromToken.symbol(), route.fromToken.decimals(), route.fromToken.readable(route.fromAmount)]);
    })).then(function (allPaymentRoutes) {
      var allPaymentRoutesWithDisplayData = allRoutes.map(function (route, index) {
        return {
          name: allPaymentRoutes[index][0],
          symbol: allPaymentRoutes[index][1].toUpperCase(),
          decimals: allPaymentRoutes[index][2],
          amount: allPaymentRoutes[index][3],
          blockchainName: route.blockchain,
          route: route
        };
      });
      setFuse(new Fuse(allPaymentRoutesWithDisplayData, {
        keys: ['name', 'symbol', 'blockchainName'],
        threshold: 0.3,
        ignoreFieldNorm: true
      }));
      var bestPaymentOptions = allPaymentRoutesWithDisplayData.filter(function (paymentRoute) {
        return paymentRoute.route.fromToken.address.toLowerCase() === paymentRoute.route.toToken.address.toLowerCase();
      });
      setBestPaymentOptions(bestPaymentOptions);
      var majorPaymentOptions = allPaymentRoutesWithDisplayData.filter(function (paymentRoute) {
        return Blockchains[paymentRoute.route.blockchain].tokens.find(function (token) {
          return token.address.toLowerCase() === paymentRoute.route.fromToken.address.toLowerCase();
        });
      });
      setMajorPaymentOptions(majorPaymentOptions);
      setNativePaymentOptions(allPaymentRoutesWithDisplayData.filter(function (paymentRoute) {
        return Blockchains[paymentRoute.route.blockchain].currency.address.toLowerCase() === paymentRoute.route.fromToken.address.toLowerCase();
      }));
      setStablePaymentOptions(allPaymentRoutesWithDisplayData.filter(function (paymentRoute) {
        return Blockchains[paymentRoute.route.blockchain].stables.usd.find(function (stable) {
          return stable.toLowerCase() === paymentRoute.route.fromToken.address.toLowerCase();
        });
      }));
      var allPaymentOptions = allPaymentRoutesWithDisplayData;
      setAllPaymentOptions(allPaymentOptions);
      setSelectedTab('all');
      setSelectedPaymentOptions(allPaymentOptions);
      setTimeout(function () {
        if (!isMobile()) {
          if (searchElement.current) {
            searchElement.current.click();
            searchElement.current.focus();
          }
        }
      }, 200);
    })["catch"](setError);
  }, [allRoutes, allRoutesLoaded]);
  var displayedPaymentOptions = selectedPaymentOptions === null || selectedPaymentOptions === void 0 ? void 0 : selectedPaymentOptions.map(function (payment, index) {
    var blockchain = Blockchains.findByName(payment.route.blockchain);
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      key: index,
      className: "Card",
      title: "Select ".concat(payment.symbol, " as payment"),
      onClick: function onClick() {
        setSelectedRoute(payment.route);
        navigate('back');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage"
    }, /*#__PURE__*/React.createElement(TokenImage, {
      blockchain: payment.route.blockchain,
      address: payment.route.fromToken.address
    }), /*#__PURE__*/React.createElement("img", {
      className: "BlockchainLogo small bottomRight " + blockchain.name,
      style: {
        backgroundColor: blockchain.logoBackgroundColor
      },
      src: blockchain.logo,
      alt: blockchain.label,
      title: blockchain.label
    })), /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardText"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenSymbolCell"
    }, payment.symbol), /*#__PURE__*/React.createElement("span", null, "\xA0"), /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, format(payment.amount)))), /*#__PURE__*/React.createElement("h3", {
      className: "CardText small"
    }, /*#__PURE__*/React.createElement("small", null, format(round(parseFloat(payment.route.fromBalance.toString()) / Math.pow(10, payment.decimals))))))));
  });

  if (!allRoutesLoaded || displayedPaymentOptions === undefined) {
    return /*#__PURE__*/React.createElement(ChangePaymentSkeleton, null);
  }

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL TextCenter"
    }, "Payment options"), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TextLeft"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TabBar"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      title: "Search for a payment option",
      style: {
        width: "100px",
        position: 'relative'
      },
      onClick: function onClick() {
        if (!(searchTerm && searchTerm.length)) {
          setSelectedTab('all');
          setSelectedPaymentOptions(allPaymentOptions);
          listElement.current.scrollTop = 0;
        }
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      ref: searchElement,
      className: "Search",
      placeholder: "Search",
      value: searchTerm,
      onChange: function onChange(event) {
        return onChangeSearch(event, fuse, allPaymentOptions);
      },
      onFocus: function onFocus() {
        if (!(searchTerm && searchTerm.length)) {
          setSelectedTab('all');
          setSelectedPaymentOptions(allPaymentOptions);
          listElement.current.scrollTop = 0;
        }
      }
    })), allPaymentOptions.length > 4 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Tab ".concat(selectedTab === 'all' && (!searchTerm || searchTerm.length == 0) ? 'active' : ''),
      title: "All available payment options",
      onClick: function onClick() {
        setSelectedTab('all');
        setSearchTerm('');
        setSelectedPaymentOptions(allPaymentOptions);
        listElement.current.scrollTop = 0;
      }
    }, "All"), allPaymentOptions.length > 4 && allBestPaymentOptions.length > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Tab ".concat(selectedTab === 'best' ? 'active' : ''),
      title: "Payment options not requiring conversion",
      onClick: function onClick() {
        setSelectedTab('best');
        setSearchTerm('');
        setSelectedPaymentOptions(allBestPaymentOptions);
        listElement.current.scrollTop = 0;
      }
    }, "Best"), allPaymentOptions.length > 4 && allStablePaymentOptions.length > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Tab ".concat(selectedTab === 'stable' ? 'active' : ''),
      title: "Stablecoins available to use",
      onClick: function onClick() {
        setSelectedTab('stable');
        setSearchTerm('');
        setSelectedPaymentOptions(allStablePaymentOptions);
        listElement.current.scrollTop = 0;
      }
    }, "Stable"), allPaymentOptions.length > 4 && allMajorPaymentOptions.length > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Tab ".concat(selectedTab === 'major' ? 'active' : ''),
      title: "Major tokens available to use",
      onClick: function onClick() {
        setSelectedTab('major');
        setSearchTerm('');
        setSelectedPaymentOptions(allMajorPaymentOptions);
        listElement.current.scrollTop = 0;
      }
    }, "Major"), allPaymentOptions.length > 4 && allNativePaymentOptions.length > 0 && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "Tab ".concat(selectedTab === 'native' ? 'active' : ''),
      title: "Native blockchain currencies available to use",
      onClick: function onClick() {
        setSelectedTab('native');
        setSearchTerm('');
        setSelectedPaymentOptions(allNativePaymentOptions);
        listElement.current.scrollTop = 0;
      }
    }, "Native"))))),
    bodyRef: listElement,
    body: /*#__PURE__*/React.createElement("div", {
      onScroll: handleOnScroll,
      className: "DialogBody ScrollHeightAnimation ".concat(listScrolled ? 'ScrollHeightMax' : 'ScrollHeightL', " PaddingTopXS PaddingBottomS")
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM"
    }, displayedPaymentOptions, displayedPaymentOptions.length === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "TextCenter Opacity05 PaddingTopS PaddingBottomS"
    }, /*#__PURE__*/React.createElement("strong", null, "Nothing found for the given search term."), /*#__PURE__*/React.createElement("br", null)), /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("button", {
      className: "Link",
      onClick: function onClick() {
        setSelectedPaymentOptions(allPaymentOptions);
        setSearchTerm('');
        searchElement.current.focus();
      }
    }, "Reset search"))))),
    footer: false
  });
});

var PaymentFailedDialog = (function () {
  var _useContext = useContext(ClosableContext),
      close = _useContext.close;

  var _useContext2 = useContext(PaymentTrackingContext),
      transaction = _useContext2.transaction;

  var _useContext3 = useContext(WalletContext),
      wallet = _useContext3.wallet;

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: false,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(ErrorGraphic, null)), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Payment Failed"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Your payment did not succeed.")), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please try again.")), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, transaction && /*#__PURE__*/React.createElement("a", {
      className: "Link",
      title: "Check transaction details",
      href: link({
        url: transaction === null || transaction === void 0 ? void 0 : transaction.url,
        target: '_blank',
        wallet: wallet
      }),
      target: "_blank",
      rel: "noopener noreferrer"
    }, "View details")))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: function onClick() {
        return close();
      }
    }, "Try again"))
  });
});

var ChevronRightIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: ["ChevronRight Icon", props.className].filter(Boolean).join(' '),
    xmlns: "http://www.w3.org/2000/svg",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, /*#__PURE__*/React.createElement("path", {
    strokeWidth: "1",
    fillRule: "evenodd",
    d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
  }));
});

var CheckmarkIcon = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "Checkmark Icon " + props.className,
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    x: "0px",
    y: "0px",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20,4.9L9.2,16l-5.4-3.9c-0.7-0.5-1.6-0.3-2.1,0.3c-0.5,0.7-0.3,1.6,0.3,2.1l6.4,4.7c0.3,0.2,0.6,0.3,0.9,0.3 c0.4,0,0.8-0.2,1.1-0.5l11.7-12c0.6-0.6,0.6-1.6,0-2.2C21.6,4.3,20.6,4.3,20,4.9z"
  }));
});

var blockTimes = {
  // in seconds
  ethereum: 12,
  bsc: 3,
  polygon: 2,
  solana: 0.2,
  optimism: 0.5,
  base: 0.5,
  arbitrum: 0.28,
  fantom: 2.5,
  avalanche: 2,
  gnosis: 5
};
var etaForConfirmations = (function (blockchain, confirmationsRequired, confirmationsPassed) {
  return (confirmationsRequired - confirmationsPassed) * blockTimes[blockchain];
});

var REQUIRES_APPROVAL_RESET = {
  'ethereum': ['0xdAC17F958D2ee523a2206206994597C13D831ec7'] // USDT on Ethereum

};
var Footer = (function () {
  var _useContext = useContext(ChangableAmountContext);
      _useContext.amount;
      _useContext.amountsMissing;

  var _useContext2 = useContext(PaymentTrackingContext),
      transaction = _useContext2.transaction,
      synchronousTracking = _useContext2.synchronousTracking,
      asynchronousTracking = _useContext2.asynchronousTracking,
      trackingInitialized = _useContext2.trackingInitialized,
      release = _useContext2.release,
      forwardTo = _useContext2.forwardTo,
      confirmationsRequired = _useContext2.confirmationsRequired,
      confirmationsPassed = _useContext2.confirmationsPassed;

  var _useContext3 = useContext(PaymentContext),
      payment = _useContext3.payment,
      paymentState = _useContext3.paymentState,
      pay = _useContext3.pay,
      approve = _useContext3.approve,
      approvalTransaction = _useContext3.approvalTransaction,
      approvalSignature = _useContext3.approvalSignature;
      _useContext3.approvalDone;
      var approvalType = _useContext3.approvalType,
      resetApproval = _useContext3.resetApproval,
      resetApprovalTransaction = _useContext3.resetApprovalTransaction;

  var _useContext4 = useContext(PaymentRoutingContext),
      updatedRouteWithNewPrice = _useContext4.updatedRouteWithNewPrice,
      updateRouteWithNewPrice = _useContext4.updateRouteWithNewPrice;

  var _useContext5 = useContext(NavigateStackContext),
      navigate = _useContext5.navigate;

  var _useContext6 = useContext(ClosableContext),
      close = _useContext6.close;

  var _useContext7 = useContext(WalletContext),
      wallet = _useContext7.wallet;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      secondsLeft = _useState2[0],
      setSecondsLeft = _useState2[1];

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      secondsLeftCountdown = _useState4[0],
      setSecondsLeftCountdown = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      requiresApprovalReset = _useState6[0],
      setRequiresApprovalReset = _useState6[1];

  var throttledUpdateRouteWithNewPrice = throttle(updateRouteWithNewPrice, 2000);
  var throttledPay = throttle(function () {
    return pay();
  }, 2000);
  var throttledApprove = throttle(function () {
    return approve();
  }, 2000);
  var throttledResetApproval = throttle(function () {
    return resetApproval();
  }, 2000);
  useEffect(function () {
    if (confirmationsRequired) {
      var interval = setInterval(function () {
        setSecondsLeftCountdown(secondsLeftCountdown + 1);
      }, 1000);
      return function () {
        clearInterval(interval);
      };
    }
  }, [confirmationsRequired, secondsLeftCountdown]);
  useEffect(function () {
    if (confirmationsPassed) {
      setSecondsLeft(etaForConfirmations(payment.route.blockchain, confirmationsRequired, confirmationsPassed) - secondsLeftCountdown);
    }
  }, [confirmationsPassed, secondsLeftCountdown]);
  useEffect(function () {
    if (confirmationsPassed) {
      setSecondsLeftCountdown(0);
    }
  }, [confirmationsPassed]);
  useEffect(function () {
    var _payment$route, _payment$route2, _payment$route3, _payment$route4;

    if (payment !== null && payment !== void 0 && (_payment$route = payment.route) !== null && _payment$route !== void 0 && _payment$route.approvalRequired && REQUIRES_APPROVAL_RESET[payment.route.blockchain] && REQUIRES_APPROVAL_RESET[payment.route.blockchain].includes(payment.token) && payment !== null && payment !== void 0 && (_payment$route2 = payment.route) !== null && _payment$route2 !== void 0 && _payment$route2.currentRouterAllowance && (payment === null || payment === void 0 ? void 0 : (_payment$route3 = payment.route) === null || _payment$route3 === void 0 ? void 0 : _payment$route3.currentRouterAllowance.toString()) != '0' && payment !== null && payment !== void 0 && (_payment$route4 = payment.route) !== null && _payment$route4 !== void 0 && _payment$route4.currentRouterAllowance.lt(ethers.BigNumber.from(payment.route.fromAmount))) {
      setRequiresApprovalReset(true);
    } else {
      setRequiresApprovalReset(false);
    }
  }, [payment]);

  var actionIndicator = function actionIndicator() {
    if (!wallet) {
      return null;
    }

    if (paymentState == 'approve' || paymentState == 'paying') {
      return /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomS PaddingTopXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicator MarginBottomXS"
      }, /*#__PURE__*/React.createElement("img", {
        src: wallet.logo
      }), /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      })), /*#__PURE__*/React.createElement("div", {
        className: "TextCenter PaddingTopXS"
      }, /*#__PURE__*/React.createElement("span", {
        className: "FontSizeL"
      }, "Confirm in your wallet"))));
    }

    return null;
  };

  var steps = function steps() {
    if (paymentState == 'approve' || paymentState == 'approving' || paymentState == 'approved' || paymentState == 'paying' && (approvalTransaction !== null && approvalTransaction !== void 0 && approvalTransaction.url || approvalSignature) || paymentState == 'sending' || paymentState == 'validating' || paymentState == 'success') {
      // --- Permit2 signature approval block ---
      var needsPermit2Transaction = approvalType === 'signature' && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.lt(payment.route.fromAmount);
      var permit2Done = Boolean(approvalTransaction === null || approvalTransaction === void 0 ? void 0 : approvalTransaction.url);
      var permit2Processing = approvalType === 'signature' && paymentState === 'approving' && !approvalSignature; // --- Spending approval block ---

      var approvalRequired = Boolean(payment.route.approvalRequired);
      var needsToApproveSpending = approvalRequired;
      var justNeedsPermit2Signature = approvalType === 'signature' && payment.route.currentPermit2Allowance && payment.route.currentPermit2Allowance.gte(payment.route.fromAmount);
      var spendingActive = paymentState === 'approve' && (approvalType == 'transaction' || approvalType === 'signature' && Boolean((approvalTransaction === null || approvalTransaction === void 0 ? void 0 : approvalTransaction.url) || justNeedsPermit2Signature));
      var spendingProcessing = paymentState === 'approving' && (approvalType == 'transaction' || justNeedsPermit2Signature);
      var spendingDone = approvalType === 'signature' && Boolean(approvalSignature) || (approvalTransaction === null || approvalTransaction === void 0 ? void 0 : approvalTransaction.url) && !['approve', 'approving'].includes(paymentState); // --- Perform payment block ---

      var paymentReady = paymentState === 'approved' || !approvalRequired || paymentState === 'paying';
      var paymentProcessing = paymentState === 'sending';
      var paymentDone = paymentState === 'validating' || paymentState === 'success'; // --- Validation block ---

      var showAsyncInit = paymentDone && asynchronousTracking && trackingInitialized === false;
      var showSyncWaiting = synchronousTracking && !release;
      var showSyncDone = synchronousTracking && release;
      return /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomS StepsWrapper"
      }, needsPermit2Transaction && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
        href: approvalTransaction ? link({
          url: approvalTransaction.url,
          target: '_blank',
          wallet: wallet
        }) : undefined,
        target: "_blank",
        className: 'Step Card small transparent' + (!permit2Done || permit2Processing ? ' active' : '') + (permit2Done ? ' done' : '') + (!(approvalTransaction !== null && approvalTransaction !== void 0 && approvalTransaction.url) ? ' disabled' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, !permit2Done && !permit2Processing && /*#__PURE__*/React.createElement("div", {
        className: "StepCircle"
      }), permit2Processing && /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      }), permit2Done && !permit2Processing && /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, !permit2Done && !permit2Processing && /*#__PURE__*/React.createElement("span", null, "Enable signature approval for ", payment.symbol), permit2Processing && /*#__PURE__*/React.createElement(LoadingText, null, "Enabling signature approval for ", payment.symbol), permit2Done && !permit2Processing && /*#__PURE__*/React.createElement("span", null, "Signature approval for ", payment.symbol, " enabled"))), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })), needsToApproveSpending && !spendingDone && approvalType !== 'transaction' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: 'Step Card disabled small transparent' + (spendingActive || spendingProcessing ? ' active' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepCircle"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, "Approve spending ", payment.symbol)), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })), approvalType === 'transaction' && approvalRequired && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
        href: approvalType === 'transaction' && approvalTransaction ? link({
          url: approvalTransaction.url,
          target: '_blank',
          wallet: wallet
        }) : undefined,
        target: "_blank",
        className: 'Step Card small transparent' + (!(approvalTransaction !== null && approvalTransaction !== void 0 && approvalTransaction.url) ? ' disabled' : '') + (spendingActive || spendingProcessing ? ' active' : '') + (spendingDone ? ' done' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, !spendingProcessing && !spendingDone && /*#__PURE__*/React.createElement("div", {
        className: "StepCircle"
      }), spendingProcessing && !spendingDone && /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      }), !spendingProcessing && spendingDone && /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, !spendingProcessing && !spendingDone && /*#__PURE__*/React.createElement("span", null, "Approve ", payment.symbol, " for spending"), !spendingProcessing && spendingDone && /*#__PURE__*/React.createElement("span", null, "Approved ", payment.symbol, " for spending"), spendingProcessing && /*#__PURE__*/React.createElement(LoadingText, null, "Approving ", payment.symbol, " for spending"))), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })), approvalType === 'signature' && spendingDone && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "Step done Card disabled small transparent"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, "Spending ", payment.symbol, " approved")), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })), transaction || paymentProcessing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
        href: transaction ? link({
          url: transaction.url,
          target: '_blank',
          wallet: wallet
        }) : undefined,
        target: "_blank",
        rel: "noopener noreferrer",
        className: 'Step Card small transparent' + (paymentReady && !paymentDone || paymentProcessing || paymentDone && !showSyncDone ? ' active' : '') + (paymentDone ? ' done' : '') + (!(transaction !== null && transaction !== void 0 && transaction.url) ? ' disabled' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, paymentDone && /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      }), paymentProcessing && /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, paymentProcessing && /*#__PURE__*/React.createElement(LoadingText, null, "Performing payment"), paymentDone && /*#__PURE__*/React.createElement("span", null, "Perform payment"))), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: 'Step Card disabled small transparent' + (paymentReady || paymentDone && !showSyncDone ? ' active' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, paymentDone ? /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      }) : /*#__PURE__*/React.createElement("div", {
        className: "StepCircle"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, "Perform payment")), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })), showAsyncInit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "Step Card disabled small transparent active"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, /*#__PURE__*/React.createElement(LoadingText, null, "Initializing tracking"))), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      })), showSyncWaiting && /*#__PURE__*/React.createElement("a", {
        href: transaction ? link({
          url: "https://scan.depay.com/tx/".concat(transaction.blockchain, "/").concat(transaction.id, "?sender=").concat(payment.route.fromAddress, "&receiver=").concat(payment.route.toAddress, "&deadline=").concat(transaction.deadline),
          target: '_blank',
          wallet: wallet
        }) : undefined,
        target: "_blank",
        className: 'Step Card small transparent' + (paymentState === 'validating' ? ' active' : '') + (!(transaction !== null && transaction !== void 0 && transaction.url) ? ' disabled' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, paymentState === 'validating' ? /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      }) : /*#__PURE__*/React.createElement("div", {
        className: "StepCircle"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, paymentState !== 'validating' && /*#__PURE__*/React.createElement("span", null, "Wait for payment confirmation"), paymentState === 'validating' && /*#__PURE__*/React.createElement(LoadingText, null, "Confirming payment"), confirmationsRequired > 0 && secondsLeft > 0 && /*#__PURE__*/React.createElement("span", {
        title: "".concat(confirmationsPassed, "/").concat(confirmationsRequired, " required confirmations")
      }, secondsLeft, "s"))), showSyncDone && /*#__PURE__*/React.createElement("a", {
        href: transaction ? link({
          url: "https://scan.depay.com/tx/".concat(transaction.blockchain, "/").concat(transaction.id, "?sender=").concat(payment.route.fromAddress, "&receiver=").concat(payment.route.toAddress, "&deadline=").concat(transaction.deadline),
          target: '_blank',
          wallet: wallet
        }) : undefined,
        target: "_blank",
        className: 'Step Card small transparent done' + (!transaction ? ' disabled' : '')
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, "Payment confirmed")));
    }
  };

  var mainAction = function mainAction() {
    if (updatedRouteWithNewPrice) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "Info"
      }, /*#__PURE__*/React.createElement("strong", null, "Exchange rate updated!"))), /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "ButtonPrimary",
        onClick: function onClick() {
          throttledUpdateRouteWithNewPrice();
        }
      }, "Reload"));
    } else if (requiresApprovalReset) {
      if (paymentState == 'initialized') {
        return /*#__PURE__*/React.createElement("div", {
          className: "PaddingBottomXS"
        }, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "ButtonPrimary",
          onClick: throttledResetApproval,
          title: "Reset approval for ".concat(payment.symbol)
        }, "Reset ", payment.symbol, " approval"));
      } else if (paymentState == 'resetting') {
        return /*#__PURE__*/React.createElement("div", {
          className: "PaddingBottomXS"
        }, /*#__PURE__*/React.createElement("a", {
          className: "ButtonPrimary",
          title: "Resetting current approval - please wait",
          href: link({
            url: resetApprovalTransaction === null || resetApprovalTransaction === void 0 ? void 0 : resetApprovalTransaction.url,
            target: '_blank',
            wallet: wallet
          }),
          target: "_blank",
          rel: "noopener noreferrer"
        }, /*#__PURE__*/React.createElement(LoadingText, null, "Resetting")));
      }
    } else if ((paymentState == 'initialized' || paymentState == 'approve' || paymentState == 'approving' || paymentState == 'approved' || paymentState == 'resetting') && payment.route) {
      var _payment$route5;

      var approvalRequired = paymentState != 'approved' && (payment === null || payment === void 0 ? void 0 : (_payment$route5 = payment.route) === null || _payment$route5 === void 0 ? void 0 : _payment$route5.approvalRequired) && (wallet === null || wallet === void 0 ? void 0 : wallet.name) != 'World App';

      if (approvalRequired) {
        if (paymentState == 'initialized') {
          return /*#__PURE__*/React.createElement("div", {
            className: "PaddingBottomXS PaddingTopXS"
          }, /*#__PURE__*/React.createElement("div", {
            className: "PaddingBottomXS MarginBottomXS MarginTopNegativeS PaddingTopXS"
          }, /*#__PURE__*/React.createElement("div", {
            className: "PaddingTopXS"
          }, /*#__PURE__*/React.createElement("button", {
            type: "button",
            className: "Card small transparent",
            title: "Change approval",
            onClick: function onClick() {
              if (paymentState != 'initialized') {
                return;
              }

              navigate('ChangeApproval');
            }
          }, /*#__PURE__*/React.createElement("div", {
            className: "CardBody"
          }, /*#__PURE__*/React.createElement("div", {
            className: "CardBodyWrapper"
          }, /*#__PURE__*/React.createElement("h4", {
            className: "CardTitle"
          }, "Approval"))), /*#__PURE__*/React.createElement("div", {
            className: "CardAction PaddingRightXS"
          }, /*#__PURE__*/React.createElement(ChevronRightIcon, {
            className: "small"
          }))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
            type: "button",
            className: "ButtonPrimary",
            onClick: throttledApprove
          }, "Approve and pay")));
        }
      } else {
        return /*#__PURE__*/React.createElement("button", {
          tabIndex: 1,
          type: "button",
          className: "ButtonPrimary",
          onClick: throttledPay
        }, "Pay");
      }
    } else if (paymentState == 'paying') {
      return null;
    } else if (paymentState == 'success') {
      if (synchronousTracking == true) {
        if (release) {
          if (forwardTo) {
            return /*#__PURE__*/React.createElement("a", {
              className: "ButtonPrimary",
              href: forwardTo,
              rel: "noopener noreferrer"
            }, "Continue");
          } else {
            return /*#__PURE__*/React.createElement("button", {
              className: "ButtonPrimary",
              onClick: close
            }, "Done");
          }
        } else {
          return null;
        }
      } else if (asynchronousTracking == true && trackingInitialized == false) {
        return null;
      } else {
        return /*#__PURE__*/React.createElement("button", {
          className: "ButtonPrimary",
          onClick: close
        }, "Done");
      }
    }
  };

  return /*#__PURE__*/React.createElement("div", null, steps(), actionIndicator(), mainAction());
});

var PaymentOverviewSkeleton = (function (props) {
  var _useContext = useContext(ChangableAmountContext),
      amountsMissing = _useContext.amountsMissing,
      fixedAmount = _useContext.fixedAmount;

  var _useContext2 = useContext(PaymentRoutingContext),
      slowRouting = _useContext2.slowRouting,
      selectedRoute = _useContext2.selectedRoute;

  var _useContext3 = useContext(ConfigurationContext),
      title = _useContext3.title;

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, title || 'Payment')),
    alternativeHeaderAction: props.alternativeHeaderAction,
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM PaddingBottomXS"
    }, amountsMissing && !fixedAmount && /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })), /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: ["PaddingTopXS PaddingRightM PaddingLeftM", selectedRoute == undefined && slowRouting ? 'PaddingBottomS' : 'PaddingBottomM'].join(' ')
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonWrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ButtonPrimary Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))), selectedRoute == undefined && slowRouting && /*#__PURE__*/React.createElement("div", {
      className: "TextCenter Opacity05 PaddingTopS"
    }, /*#__PURE__*/React.createElement("strong", null, "Loading payment options...")))
  });
});

var PaymentOverviewDialog = (function (props) {
  var _useContext = useContext(ConfigurationContext),
      currencyCode = _useContext.currencyCode,
      amountConfiguration = _useContext.amount,
      currency = _useContext.currency,
      title = _useContext.title;

  var _useContext2 = useContext(PaymentContext),
      payment = _useContext2.payment,
      paymentState = _useContext2.paymentState;

  var _useContext3 = useContext(ChangableAmountContext),
      amount = _useContext3.amount,
      amountsMissing = _useContext3.amountsMissing,
      fixedAmount = _useContext3.fixedAmount,
      fixedCurrency = _useContext3.fixedCurrency;

  var _useContext4 = useContext(WalletContext),
      disconnect = _useContext4.disconnect,
      wallet = _useContext4.wallet,
      account = _useContext4.account;

  var _useContext5 = useContext(PaymentValueContext),
      paymentValue = _useContext5.paymentValue,
      displayedPaymentValue = _useContext5.displayedPaymentValue;

  var _useContext6 = useContext(NavigateStackContext),
      navigate = _useContext6.navigate;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showDropDown = _useState2[0],
      setShowDropDown = _useState2[1];

  var displayedCurrencyCode = amountConfiguration != undefined && amountConfiguration.token ? null : currencyCode;
  var alternativeHeaderActionElement = /*#__PURE__*/React.createElement("span", {
    className: "DropDownWrapper"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setShowDropDown(!showDropDown);
    },
    className: "ButtonCircular"
  }, /*#__PURE__*/React.createElement(MenuIcon, null)), showDropDown && /*#__PURE__*/React.createElement(DropDown, {
    hide: function hide() {
      return setShowDropDown(false);
    },
    items: [{
      label: "Contact support",
      action: function action() {
        window.open("https://support.depay.com?wallet=".concat(wallet === null || wallet === void 0 ? void 0 : wallet.name, "&account=").concat(account, "&query=").concat(encodeURIComponent("Need help with Payment")), '_blank');
      }
    }, paymentState == 'initialized' ? {
      label: "Disconnect wallet",
      action: disconnect
    } : undefined].filter(Boolean)
  }));

  if (payment == undefined) {
    return /*#__PURE__*/React.createElement(PaymentOverviewSkeleton, {
      alternativeHeaderAction: alternativeHeaderActionElement
    });
  }

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, title || "Payment")),
    alternativeHeaderAction: alternativeHeaderActionElement,
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM"
    }, amountsMissing && !fixedAmount && /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
      title: paymentState == 'initialized' ? "Change amount" : undefined,
      onClick: function onClick() {
        if (paymentState != 'initialized') {
          return;
        }

        navigate('ChangeAmount');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "CardTitle"
    }, "Amount"), /*#__PURE__*/React.createElement("div", {
      className: "CardText"
    }, displayedCurrencyCode && /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow"
    }, new Currency({
      amount: amount.toFixed(2),
      code: currencyCode
    }).toString()), !displayedCurrencyCode && /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow"
    }, amount)))), /*#__PURE__*/React.createElement("div", {
      className: "CardAction"
    }, /*#__PURE__*/React.createElement(ChevronRightIcon, null))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
      title: paymentState == 'initialized' ? "Change payment" : undefined,
      onClick: function onClick() {
        if (paymentState != 'initialized') {
          return;
        }

        navigate('ChangePayment');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage",
      title: payment.name
    }, /*#__PURE__*/React.createElement(TokenImage, {
      blockchain: payment.blockchain.name,
      address: payment.token
    }), /*#__PURE__*/React.createElement("img", {
      className: "BlockchainLogo small bottomRight " + payment.blockchain.name,
      style: {
        backgroundColor: payment.blockchain.logoBackgroundColor
      },
      src: payment.blockchain.logo,
      alt: payment.blockchain.label,
      title: payment.blockchain.label
    })), /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper"
    }, amountsMissing && !fixedCurrency && /*#__PURE__*/React.createElement("h4", {
      className: "CardTitle"
    }, "Payment"), /*#__PURE__*/React.createElement("div", {
      className: "CardText"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenSymbolCell"
    }, payment.symbol), /*#__PURE__*/React.createElement("span", null, "\xA0"), /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, format(payment.amount))), !(amountsMissing && !fixedCurrency) && currency !== false && /*#__PURE__*/React.createElement(React.Fragment, null, paymentValue && displayedPaymentValue != "".concat(payment.symbol, " ").concat(format(payment.amount)) && /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow small Opacity05"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, displayedPaymentValue)), !paymentValue && /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow small"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton",
      style: {
        position: 'relative',
        marginTop: '2px',
        borderRadius: '10px',
        width: '82px',
        height: '15px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })))))))), /*#__PURE__*/React.createElement("div", {
      className: "CardAction"
    }, /*#__PURE__*/React.createElement(ChevronRightIcon, null)))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement(Footer, null))
  });
});

function getFavicon () {
  var favicon;
  var nodeList = document.getElementsByTagName("link");

  for (var i = 0; i < nodeList.length; i++) {
    if (nodeList[i].getAttribute("rel") == "icon" || nodeList[i].getAttribute("rel") == "shortcut icon") {
      favicon = nodeList[i].getAttribute("href");
    }
  }

  if (!favicon) {
    return;
  }

  if (favicon.match(':')) {
    return favicon;
  } else {
    return "".concat(window.location.origin, "/").concat(favicon.replace(/^\//, ''));
  }
}

var getPaymentRouterInstruction = (function (confirmedTransaction) {
  var _confirmedTransaction, _confirmedTransaction2, _confirmedTransaction3;

  if (!confirmedTransaction || !(confirmedTransaction !== null && confirmedTransaction !== void 0 && (_confirmedTransaction = confirmedTransaction.meta) !== null && _confirmedTransaction !== void 0 && _confirmedTransaction.logMessages) || !(confirmedTransaction !== null && confirmedTransaction !== void 0 && (_confirmedTransaction2 = confirmedTransaction.transaction) !== null && _confirmedTransaction2 !== void 0 && (_confirmedTransaction3 = _confirmedTransaction2.message) !== null && _confirmedTransaction3 !== void 0 && _confirmedTransaction3.compiledInstructions)) {
    return;
  }

  if (!confirmedTransaction.meta.logMessages.some(function (log) {
    return log.match("Program ".concat(routers.solana.address, " invoke"));
  })) {
    return;
  }

  var foundInstruction;
  confirmedTransaction.transaction.message.compiledInstructions.forEach(function (instruction) {
    Object.keys(routers.solana.api).forEach(function (key) {
      if (foundInstruction) {
        return;
      }

      try {
        if (key.match(/^route/)) {
          var data = routers.solana.api[key].layout.decode(instruction.data);

          if (data.anchorDiscriminator.toString() === routers.solana.api[key].anchorDiscriminator.toString()) {
            foundInstruction = data;
          }
        }
      } catch (_unused) {}
    });
  });
  return foundInstruction;
});

var sockets = {};
var socketsPingIntervals = {};
var keepAliveIntervals = {};
var retryCounts = {};
var endpointIndices = {};

var openManagedSocket = function openManagedSocket(_ref) {
  var identifier = _ref.identifier,
      onopen = _ref.onopen,
      onmessage = _ref.onmessage,
      keepAlive = _ref.keepAlive,
      endpoint = _ref.endpoint,
      endpoints = _ref.endpoints;
  var endpointsList = Array.isArray(endpoints) ? endpoints : [endpoint || 'wss://integrate.depay.com/cable'];

  if (retryCounts[identifier] === undefined) {
    retryCounts[identifier] = 0;
  }

  if (endpointIndices[identifier] === undefined) {
    endpointIndices[identifier] = 0;
  }

  if (socketsPingIntervals[identifier]) {
    clearInterval(socketsPingIntervals[identifier]);
  }

  if (keepAliveIntervals[identifier]) {
    clearInterval(keepAliveIntervals[identifier]);
  }

  if (sockets[identifier]) {
    sockets[identifier].close();
  }

  if (endpoints) {
    endpoint = endpoints[0];
  }

  var currentEndpoint = endpointsList[endpointIndices[identifier]];
  var socket = new WebSocket(currentEndpoint);
  sockets[identifier] = socket;
  var keepAliveInterval;

  if (keepAlive) {
    keepAliveInterval = setInterval(function () {
      if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(socket.readyState)) {
        clearInterval(keepAliveInterval);
      } else {
        socket.send(JSON.stringify(keepAlive.callback()));
      }
    }, keepAlive.interval);
    keepAliveIntervals[identifier] = keepAliveInterval;
  }

  var lastPing;
  var pingInterval = setInterval(function () {
    if (lastPing && lastPing < Date.now() - 10 * 1000) {
      clearInterval(pingInterval);

      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }

      if ([WebSocket.CLOSING, WebSocket.CLOSED].includes(socket.readyState)) {
        clearInterval(pingInterval);
      } else {
        socket.close(3000); // force reopen
      }
    }
  }, 5000);
  socketsPingIntervals[identifier] = pingInterval;
  socket.onopen = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
    var message;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(typeof onopen == 'function')) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return onopen();

          case 3:
            message = _context.sent;

            if (!message) {
              _context.next = 7;
              break;
            }

            _context.next = 7;
            return socket.send(JSON.stringify(message), socket);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  socket.onclose = function (event) {
    if (!event || event.code != 1000) {
      retryCounts[identifier]++;
      var delay = Math.min(10000, 1000 * Math.pow(2, retryCounts[identifier] - 1));
      endpointIndices[identifier] = (endpointIndices[identifier] + 1) % endpointsList.length;

      if (pingInterval) {
        clearInterval(pingInterval);
      }

      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }

      console.log("Reconnecting socket \"".concat(identifier, "\" in ").concat(delay, "ms (attempt #").concat(retryCounts[identifier], ")"));
      setTimeout(function () {
        openManagedSocket({
          identifier: identifier,
          onopen: onopen,
          onmessage: onmessage,
          keepAlive: keepAlive,
          endpoint: endpoint,
          endpoints: endpoints
        });
      }, delay);
    }
  };

  socket.onmessage = function (event) {
    lastPing = Date.now();
    var eventData = JSON.parse(event.data);

    if (eventData.error) {
      if (pingInterval) {
        clearInterval(pingInterval);
      }

      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }

      socket.close(3000); // force reopen
    } else if (typeof onmessage == 'function') {
      onmessage(eventData, socket);
    }
  };

  socket.onerror = function (error) {
    console.log('WebSocket Error: ', identifier, error);
  };

  return socket;
};

var SolanaPayLogo = (function (props) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "SolanaPayLogo",
    width: "86",
    height: "32",
    viewBox: "0 0 86 32",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M77.1128 22.0065L72.1479 11.1583H68.027L75.1197 25.7956L74.9921 26.2364C74.8144 26.8223 74.4395 27.3282 73.9311 27.6679C73.4228 28.0076 72.8125 28.1599 72.2046 28.0989C71.493 28.0923 70.7948 27.9039 70.1761 27.5515L69.5165 30.6865C70.4684 31.0797 71.4871 31.2849 72.5167 31.2908C75.3538 31.2908 77.0702 30.2458 78.4888 27.1676L86 11.1583H82.021L77.1128 22.0065Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M42.0235 5.99011H30.1219V25.9306H34.0229V18.6013H42.0235C46.3713 18.6013 49.2297 16.4047 49.2297 12.2957C49.2297 8.18677 46.3713 5.99011 42.0235 5.99011ZM41.8107 15.1109H34.0087V9.42372H41.8107C44.0662 9.42372 45.357 10.4545 45.357 12.2673C45.357 14.0801 44.0662 15.1109 41.8107 15.1109Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M65.539 22.1487V16.1416C65.539 12.5872 62.9928 10.746 58.6236 10.746C55.0773 10.746 51.9706 12.4024 51.0982 14.9473L54.3042 16.0848C54.7794 14.8123 56.432 13.8739 58.4889 13.8739C60.9288 13.8739 61.9572 14.8691 61.9572 16.0848V16.4758L56.1554 17.1156C52.8147 17.471 50.6159 18.971 50.6159 21.6511C50.6159 24.587 53.1339 26.1652 56.4745 26.1652C58.6278 26.2325 60.7248 25.4691 62.3331 24.0325C62.9147 25.4543 63.5105 26.4069 67.4754 25.9022V22.9307C65.8866 23.3145 65.539 22.9307 65.539 22.1487ZM61.9927 20.2435C61.9927 22.1771 59.2903 23.2008 57.0278 23.2008C55.3042 23.2008 54.2687 22.6463 54.2687 21.5444C54.2687 20.4425 55.1198 20.0444 56.7653 19.8525L62.0069 19.2411L61.9927 20.2435Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22.7439 21.253C22.7714 21.3361 22.7714 21.4259 22.7439 21.5089C22.7279 21.5918 22.6885 21.6683 22.6304 21.7293L18.8783 25.6748C18.7956 25.7599 18.6968 25.8276 18.5875 25.8738C18.478 25.9219 18.3595 25.9462 18.24 25.9449H0.444308C0.361894 25.9456 0.280888 25.9235 0.210248 25.8809C0.139655 25.8328 0.0833028 25.7665 0.0471156 25.689C0.0221236 25.6104 0.0221236 25.5259 0.0471156 25.4473C0.0618237 25.3655 0.0986193 25.2892 0.153506 25.2269L3.91265 21.2815C3.99533 21.1963 4.09422 21.1286 4.20346 21.0824C4.31277 21.0337 4.43137 21.0094 4.551 21.0113H22.3183C22.404 21.0097 22.4882 21.0345 22.5594 21.0824C22.6393 21.1154 22.7047 21.1759 22.7439 21.253ZM18.8854 13.7602C18.8009 13.6773 18.7025 13.6099 18.5946 13.5612C18.484 13.5164 18.3663 13.4924 18.2471 13.4901H0.444308C0.360864 13.4913 0.27943 13.5159 0.209231 13.5612C0.139032 13.6064 0.0828724 13.6704 0.0471156 13.746C0.0225831 13.8247 0.0225831 13.909 0.0471156 13.9877C0.0590607 14.0704 0.0962206 14.1474 0.153506 14.2081L3.91265 18.1606C3.99717 18.2436 4.09561 18.311 4.20346 18.3597C4.31383 18.405 4.43173 18.4291 4.551 18.4308H22.3183C22.404 18.4324 22.4882 18.4076 22.5594 18.3597C22.6311 18.3178 22.6861 18.2526 22.7155 18.1749C22.7518 18.0992 22.7639 18.0141 22.7499 17.9314C22.7359 17.8486 22.6966 17.7722 22.6375 17.7128L18.8854 13.7602ZM0.210248 10.8455C0.280888 10.8881 0.361894 10.9102 0.444308 10.9095H18.2471C18.3666 10.9108 18.4851 10.8865 18.5946 10.8384C18.7038 10.7922 18.8027 10.7246 18.8854 10.6394L22.6375 6.69394C22.6956 6.63288 22.7349 6.55639 22.7509 6.47356C22.7755 6.39487 22.7755 6.31055 22.7509 6.23186C22.7216 6.15414 22.6665 6.08889 22.5949 6.04702C22.5237 5.99912 22.4395 5.9743 22.3538 5.97593H4.52263C4.403 5.97402 4.2844 5.99828 4.17509 6.04702C4.06585 6.09322 3.96696 6.1609 3.88428 6.24607L0.132229 10.2057C0.0727337 10.2658 0.0331119 10.3427 0.0187441 10.4261C-0.00624802 10.5047 -0.00624802 10.5892 0.0187441 10.6678C0.0647789 10.7438 0.131116 10.8054 0.210248 10.8455V10.8455Z"
  }));
});

var TracingFailedDialog = (function (props) {
  var _useContext = useContext(NavigateStackContext),
      navigate = _useContext.navigate;

  var _useContext2 = useContext(WalletContext),
      account = _useContext2.account;

  var tryAgain = function tryAgain() {
    if (props.tryAgain) {
      props.tryAgain();
    } else {
      navigate('back');
    }
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: false,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingRightM"
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://support.depay.com?account=".concat(account, "&query=").concat(encodeURIComponent("Tracing payment failed")),
      target: "_blank",
      className: "Card secondary small inlineBlock"
    }, "Contact support"))),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(ErrorGraphic, null)), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Tracking payment failed"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please ensure you are connected to the internet, then click \"Try again\"."), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("span", null, "If this keeps happening, please report it.")))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: tryAgain
    }, "Try again"))
  });
});

var UUIDv4 = (function () {
  var d = new Date().getTime();
  var d2 = performance && performance.now && performance.now() * 1000 || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;

    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }

    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
});

var SolanaPayDialog = (function (props) {
  var _useContext = useContext(ConfigurationContext),
      accept = _useContext.accept,
      allow = _useContext.allow,
      deny = _useContext.deny;

  var _useContext2 = useContext(CallbackContext),
      callSentCallback = _useContext2.callSentCallback,
      callSucceededCallback = _useContext2.callSucceededCallback,
      callFailedCallback = _useContext2.callFailedCallback;

  var _useContext3 = useContext(NavigateStackContext),
      navigate = _useContext3.navigate;

  var _useContext4 = useContext(ClosableContext),
      close = _useContext4.close,
      setClosable = _useContext4.setClosable;

  var _useContext5 = useContext(WalletContext),
      solanaPayWallet = _useContext5.solanaPayWallet,
      setAccount = _useContext5.setAccount;

  var _useContext6 = useContext(PaymentTrackingContext),
      synchronousTracking = _useContext6.synchronousTracking,
      track = _useContext6.track,
      trace = _useContext6.trace,
      release = _useContext6.release,
      validationState = _useContext6.validationState,
      forwardTo = _useContext6.forwardTo;

  var _useContext7 = useContext(PaymentRoutingContext),
      setSelectedRoute = _useContext7.setSelectedRoute;

  var _useContext8 = useContext(PaymentValueContext),
      paymentValue = _useContext8.paymentValue,
      displayedPaymentValue = _useContext8.displayedPaymentValue;

  var _useContext9 = useContext(PaymentTrackingContext),
      setTransaction = _useContext9.setTransaction;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      selectedPaymentOption = _useState2[0],
      setSelectedPaymentOption = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      QRCodeURI = _useState4[0],
      setQRCodeURI = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      QRCode = _useState6[0],
      setQRCode = _useState6[1];

  var _useState7 = useState('initializing'),
      _useState8 = _slicedToArray(_useState7, 2),
      state = _useState8[0],
      setState = _useState8[1];

  var _useState9 = useState(false),
      _useState10 = _slicedToArray(_useState9, 2),
      showDropDown = _useState10[0],
      setShowDropDown = _useState10[1];

  var QRCodeElement = useRef();
  var solanaPayTransactionPollingInterval = useRef();
  var solanaPayTransactionSocket = useRef();
  var transactionTrackingSocket = useRef();
  var afterBlock = useRef();
  var currentDeadline = useRef();
  var secretId = useRef();
  var transactionPollingInterval = useRef();
  var solanPayPayment = useRef();
  var transaction = useRef();

  var getNewQRCode = function getNewQRCode() {
    return new QRCodeStyling({
      width: 340,
      height: 340,
      type: "svg",
      dotsOptions: {
        type: "extra-rounded",
        color: isDarkMode() ? "#FFFFFF" : "#000000"
      },
      cornersSquareOptions: {
        type: 'rounded'
      },
      backgroundOptions: {
        color: "transparent"
      }
    });
  };

  var startSolanaPayTransactionPolling = function startSolanaPayTransactionPolling() {
    if (solanaPayTransactionPollingInterval.current) {
      clearInterval(solanaPayTransactionPollingInterval.current);
    }

    solanaPayTransactionPollingInterval.current = setInterval(function () {
      fetch("https://public.depay.com/solanapay/".concat(secretId.current, "/status"), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (response.status == 200) {
          return response.json();
        } else {
          return undefined;
        }
      }).then(function (data) {
        if (data && data.sender) {
          clearInterval(solanaPayTransactionPollingInterval.current);
          transactionLoaded(data);
        }
      });
    }, 2000);
  };

  var openSolanaPayTransactionSocket = function openSolanaPayTransactionSocket() {
    if (solanaPayTransactionSocket.current) {
      solanaPayTransactionSocket.current.close(1000);
    }

    var identifier = JSON.stringify({
      secret_id: secretId.current,
      channel: 'SolanaPayChannel'
    });
    solanaPayTransactionSocket.current = openManagedSocket({
      identifier: identifier,
      onopen: function onopen() {
        return {
          command: 'subscribe',
          identifier: identifier
        };
      },
      onmessage: function onmessage(eventData, socket) {
        var _eventData$message, _eventData$message2, _eventData$message3;

        if ((eventData === null || eventData === void 0 ? void 0 : eventData.type) == 'confirm_subscription') {
          socket.send(JSON.stringify({
            command: 'message',
            identifier: identifier,
            data: JSON.stringify({
              event: 'create',
              secret_id: secretId.current,
              label: document.title || 'DePay',
              icon: getFavicon() || 'https://depay.com/favicon.png',
              accept: accept,
              allow: allow,
              deny: deny
            })
          }));
        } else if ((eventData === null || eventData === void 0 ? void 0 : (_eventData$message = eventData.message) === null || _eventData$message === void 0 ? void 0 : _eventData$message.event) === 'created') {
          startSolanaPayTransactionPolling();
          setQRCodeURI("solana:https://public.depay.com/solanapay/".concat(secretId.current));
        } else if ((eventData === null || eventData === void 0 ? void 0 : (_eventData$message2 = eventData.message) === null || _eventData$message2 === void 0 ? void 0 : _eventData$message2.event) === 'scanned') {
          if (!solanPayPayment.current) {
            setClosable("Are you sure you want to abort this payment?");
            setState('pay');
          }
        } else if ((eventData === null || eventData === void 0 ? void 0 : (_eventData$message3 = eventData.message) === null || _eventData$message3 === void 0 ? void 0 : _eventData$message3.event) === 'loaded') {
          if (!solanPayPayment.current) {
            transactionLoaded(eventData.message);
            setClosable("Are you sure you want to abort this payment?");
            setState('pay');
          }
        }
      },
      keepAlive: {
        interval: 3000,
        callback: function callback() {
          return {
            type: "ping",
            message: Math.floor(Date.now() / 1000)
          };
        }
      }
    });
  };

  var openTransactionTrackingSocket = function openTransactionTrackingSocket(_ref) {
    var sender = _ref.sender,
        receiver = _ref.receiver,
        deadline = _ref.deadline;

    if (transactionTrackingSocket.current) {
      transactionTrackingSocket.current.close(1000);
    }

    var id = 1;
    transactionTrackingSocket.current = openManagedSocket({
      identifier: JSON.stringify({
        type: 'SolanaTransactionLogSubscription',
        sender: sender,
        receiver: receiver,
        deadline: deadline
      }),
      endpoints: Blockchains.solana.sockets.reverse(),
      onopen: function onopen() {
        return {
          "jsonrpc": "2.0",
          "id": id,
          "method": "logsSubscribe",
          "params": [{
            "mentions": [sender]
          }]
        };
      },
      onmessage: function () {
        var _onmessage = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(eventData, socket) {
          var _eventData$params, _eventData$params$res, _eventData$params$res2, _ref2, _eventData$params2, _eventData$params2$re, _eventData$params2$re2, provider, transactionId, fullTransactionData, foundRouterInstruction, _eventData$params3, _eventData$params3$re, _fullTransactionData$, result;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!eventData) {
                    _context.next = 11;
                    break;
                  }

                  if (!(eventData && eventData !== null && eventData !== void 0 && (_eventData$params = eventData.params) !== null && _eventData$params !== void 0 && (_eventData$params$res = _eventData$params.result) !== null && _eventData$params$res !== void 0 && (_eventData$params$res2 = _eventData$params$res.value) !== null && _eventData$params$res2 !== void 0 && _eventData$params$res2.logs && (_ref2 = (eventData === null || eventData === void 0 ? void 0 : (_eventData$params2 = eventData.params) === null || _eventData$params2 === void 0 ? void 0 : (_eventData$params2$re = _eventData$params2.result) === null || _eventData$params2$re === void 0 ? void 0 : (_eventData$params2$re2 = _eventData$params2$re.value) === null || _eventData$params2$re2 === void 0 ? void 0 : _eventData$params2$re2.logs) || []) !== null && _ref2 !== void 0 && _ref2.find(function (log) {
                    return log.match("Program ".concat(routers.solana.address));
                  }))) {
                    _context.next = 11;
                    break;
                  }

                  _context.next = 4;
                  return getProvider('solana');

                case 4:
                  provider = _context.sent;
                  transactionId = eventData.params.result.value.signature;
                  _context.next = 8;
                  return provider.getTransaction(transactionId, {
                    commitment: 'confirmed',
                    maxSupportedTransactionVersion: 0
                  });

                case 8:
                  fullTransactionData = _context.sent;
                  foundRouterInstruction = getPaymentRouterInstruction(fullTransactionData);

                  if (foundRouterInstruction && foundRouterInstruction.deadline.toString() === deadline.toString()) {
                    result = eventData === null || eventData === void 0 ? void 0 : (_eventData$params3 = eventData.params) === null || _eventData$params3 === void 0 ? void 0 : (_eventData$params3$re = _eventData$params3.result) === null || _eventData$params3$re === void 0 ? void 0 : _eventData$params3$re.value;
                    setTransaction({
                      blockchain: 'solana',
                      id: transactionId,
                      url: Blockchains.solana.explorerUrlFor({
                        transaction: {
                          id: transactionId
                        }
                      })
                    });

                    if ((fullTransactionData === null || fullTransactionData === void 0 ? void 0 : (_fullTransactionData$ = fullTransactionData.meta) === null || _fullTransactionData$ === void 0 ? void 0 : _fullTransactionData$.err) !== null) {
                      transactionFound(result.signature);
                      socket.close(1000);
                      setClosable(true);
                      callFailedCallback(transaction.current, solanPayPayment.current);
                      navigate('PaymentFailed');
                    } else if (result) {
                      transactionFound(result.signature);
                      setState('succeeded');
                      callSucceededCallback(transaction.current, solanPayPayment.current);
                      socket.close(1000);
                    }
                  }

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function onmessage(_x, _x2) {
          return _onmessage.apply(this, arguments);
        }

        return onmessage;
      }(),
      keepAlive: {
        interval: 3000,
        callback: function callback() {
          return {
            jsonrpc: "2.0",
            id: id++,
            method: "getVersion",
            params: []
          };
        }
      }
    });
  };

  var startTransactionPolling = function startTransactionPolling(_ref3) {
    var sender = _ref3.sender;
        _ref3.receiver;
        var deadline = _ref3.deadline;

    if (transactionPollingInterval.current) {
      clearInterval(transactionPollingInterval.current);
    }

    transactionPollingInterval.current = setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
      var provider, signatures, relevantTransactions;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getProvider('solana');

            case 2:
              provider = _context3.sent;
              _context3.next = 5;
              return provider.getSignaturesForAddress(new PublicKey(sender));

            case 5:
              signatures = _context3.sent;

              if (signatures && signatures.length && signatures[0].slot > afterBlock.current) {
                relevantTransactions = signatures.filter(function (signature) {
                  return signature.slot > afterBlock.current;
                });
                relevantTransactions.forEach( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(relevantTransaction) {
                    var transactionId, fullTransactionData, foundRouterInstruction, _fullTransactionData$2;

                    return regenerator.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            transactionId = relevantTransaction.signature;
                            _context2.next = 3;
                            return provider.getTransaction(transactionId, {
                              commitment: 'confirmed',
                              maxSupportedTransactionVersion: 0
                            });

                          case 3:
                            fullTransactionData = _context2.sent;
                            foundRouterInstruction = getPaymentRouterInstruction(fullTransactionData);

                            if (foundRouterInstruction && foundRouterInstruction.deadline.toString() === deadline.toString()) {
                              transactionFound(fullTransactionData.transaction.signatures[0]);
                              setTransaction({
                                blockchain: 'solana',
                                id: transactionId,
                                url: Blockchains.solana.explorerUrlFor({
                                  transaction: {
                                    id: transactionId
                                  }
                                })
                              });

                              if (transactionPollingInterval.current) {
                                clearInterval(transactionPollingInterval.current);
                              }

                              if ((fullTransactionData === null || fullTransactionData === void 0 ? void 0 : (_fullTransactionData$2 = fullTransactionData.meta) === null || _fullTransactionData$2 === void 0 ? void 0 : _fullTransactionData$2.err) !== null) {
                                callFailedCallback(transaction.current, solanPayPayment.current);
                                navigate('PaymentFailed');
                              } else {
                                setState('succeeded');
                                callSucceededCallback(transaction.current, solanPayPayment.current);
                              }
                            }

                          case 6:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x3) {
                    return _ref5.apply(this, arguments);
                  };
                }());
              }

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })), 1000);
  };

  var transactionFound = function transactionFound(transactionId) {
    transaction.current = {
      from: solanPayPayment.current.fromAddress,
      blockchain: 'solana',
      status: 'succeeded',
      id: transactionId,
      url: Blockchains.solana.explorerUrlFor({
        transaction: {
          id: transactionId
        }
      })
    };
    setTransaction(transaction.current);
    callSentCallback(transaction.current, solanPayPayment.current);
    setClosable(release || !synchronousTracking);
    track(transaction.current, afterBlock.current, solanPayPayment.current, solanPayPayment.current.deadline);
  };

  var attemptTracing = function attemptTracing() {
    return trace(afterBlock.current, solanPayPayment.current, currentDeadline.current)["catch"](function () {
      setState('tracingFailed');
    });
  };

  var transactionLoaded = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(_ref6) {
      var sender, from_token, from_amount, from_decimals, to_token, to_amount, to_decimals, fee_amount, fee_receiver, fee2_amount, fee2_receiver, protocol_fee_amount, receiver, deadline, token;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              sender = _ref6.sender, from_token = _ref6.from_token, from_amount = _ref6.from_amount, from_decimals = _ref6.from_decimals, to_token = _ref6.to_token, to_amount = _ref6.to_amount, to_decimals = _ref6.to_decimals, fee_amount = _ref6.fee_amount, fee_receiver = _ref6.fee_receiver, fee2_amount = _ref6.fee2_amount, fee2_receiver = _ref6.fee2_receiver, protocol_fee_amount = _ref6.protocol_fee_amount, receiver = _ref6.receiver, deadline = _ref6.deadline;
              setAccount(sender);

              if (!solanPayPayment.current) {
                _context4.next = 4;
                break;
              }

              return _context4.abrupt("return");

            case 4:
              solanPayPayment.current = {
                blockchain: 'solana',
                fromAddress: sender,
                fromToken: {
                  address: from_token
                },
                fromAmount: from_amount,
                fromDecimals: from_decimals,
                toToken: {
                  address: to_token
                },
                toAmount: to_amount,
                toDecimals: to_decimals,
                toAddress: receiver,
                fee: {
                  receiver: fee_receiver
                },
                feeAmount: fee_amount,
                fee2: {
                  receiver: fee2_receiver
                },
                feeAmount2: fee2_amount,
                protocolFeeAmount: protocol_fee_amount,
                deadline: deadline
              };
              currentDeadline.current = deadline;
              setSelectedRoute(solanPayPayment.current);
              attemptTracing();
              openTransactionTrackingSocket({
                sender: sender,
                receiver: receiver,
                deadline: deadline
              });
              startTransactionPolling({
                sender: sender,
                receiver: receiver,
                deadline: deadline
              });
              token = new Token({
                blockchain: 'solana',
                address: from_token
              });
              _context4.t0 = setSelectedPaymentOption;
              _context4.t1 = from_token;
              _context4.next = 15;
              return token.readable(from_amount);

            case 15:
              _context4.t2 = _context4.sent;
              _context4.next = 18;
              return token.symbol();

            case 18:
              _context4.t3 = _context4.sent;
              _context4.t4 = {
                token: _context4.t1,
                amount: _context4.t2,
                symbol: _context4.t3
              };
              (0, _context4.t0)(_context4.t4);

            case 21:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function transactionLoaded(_x4) {
      return _ref7.apply(this, arguments);
    };
  }();

  var reset = function reset() {
    if (solanaPayTransactionPollingInterval.current) {
      clearInterval(solanaPayTransactionPollingInterval.current);
    }

    if (transactionPollingInterval.current) {
      clearInterval(transactionPollingInterval.current);
    }

    if (solanaPayTransactionSocket.current) {
      solanaPayTransactionSocket.current.close(1000);
    }

    if (transactionTrackingSocket.current) {
      transactionTrackingSocket.current.close(1000);
    }

    if (afterBlock.current) {
      afterBlock.current = undefined;
    }

    if (currentDeadline.current) {
      currentDeadline.current = undefined;
    }

    if (secretId.current) {
      secretId.current = undefined;
    }

    if (solanPayPayment.current) {
      solanPayPayment.current = undefined;
    }

    setSelectedPaymentOption();
  };

  var initializeSolanaPay = function initializeSolanaPay() {
    reset();
    request({
      blockchain: 'solana',
      method: 'latestBlockNumber'
    }).then(function (latestBlock) {
      if (latestBlock) {
        afterBlock.current = latestBlock;
        secretId.current = UUIDv4();
        openSolanaPayTransactionSocket();
      }
    });
  };

  var alternativeHeaderActionElement = /*#__PURE__*/React.createElement("span", {
    className: "DropDownWrapper"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setShowDropDown(!showDropDown);
    },
    className: "ButtonCircular"
  }, /*#__PURE__*/React.createElement(MenuIcon, null)), showDropDown && /*#__PURE__*/React.createElement(DropDown, {
    hide: function hide() {
      return setShowDropDown(false);
    },
    items: [{
      label: "Contact support",
      action: function action() {
        window.open("https://support.depay.com?query=".concat(encodeURIComponent("Need help with Solana Pay")), '_blank');
      }
    }].filter(Boolean)
  }));
  useEffect(function () {
    initializeSolanaPay();
    return reset;
  }, []);
  useEffect(function () {
    var newQRCode = getNewQRCode();
    newQRCode.update({
      data: QRCodeURI
    });
    setQRCode(newQRCode);
  }, [QRCodeURI]);
  useEffect(function () {
    if (afterBlock.current && QRCode) {
      setTimeout(function () {
        return setState('scan');
      }, 400);
    }
  }, [afterBlock && QRCode]);
  useEffect(function () {
    if (state === 'scan' && QRCode && QRCodeElement && QRCodeElement.current) {
      QRCodeElement.current.innerHTML = "";
      QRCode.append(QRCodeElement.current);
    }
  }, [state, QRCode]);
  useEffect(function () {
    if (release && synchronousTracking) {
      setClosable(true);
    }
  }, [release, synchronousTracking]);

  if (state === 'tracingFailed') {
    return /*#__PURE__*/React.createElement(TracingFailedDialog, {
      tryAgain: function tryAgain() {
        setState('pay');
        attemptTracing();
      }
    });
  }

  if (state === 'initializing') {
    return /*#__PURE__*/React.createElement(Dialog$1, {
      alternativeHeaderAction: alternativeHeaderActionElement,
      header: /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "LineHeightL FontSizeL TextLeft"
      }, /*#__PURE__*/React.createElement(SolanaPayLogo, null)))),
      body: /*#__PURE__*/React.createElement("div", {
        className: "MaxHeight"
      }, /*#__PURE__*/React.createElement("div", {
        className: "PaddingLeftL PaddingRightL PaddingTopS TextCenter"
      }, /*#__PURE__*/React.createElement("div", {
        className: "Card Skeleton",
        style: {
          width: '100%',
          height: '300px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonBackground"
      }))))
    });
  } else {
    var _transaction$current;

    return /*#__PURE__*/React.createElement(Dialog$1, {
      alternativeHeaderAction: alternativeHeaderActionElement,
      header: /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "LineHeightL FontSizeL TextLeft"
      }, /*#__PURE__*/React.createElement(SolanaPayLogo, null)))),
      body: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "PaddingLeftM PaddingRightM"
      }, state === 'scan' && /*#__PURE__*/React.createElement("div", {
        ref: QRCodeElement,
        className: "QRCode"
      }), ['pay', 'succeeded'].includes(state) && /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS"
      }, !selectedPaymentOption && /*#__PURE__*/React.createElement("div", {
        className: "Card Skeleton"
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonBackground"
      })), selectedPaymentOption && /*#__PURE__*/React.createElement("div", {
        className: "Card disabled"
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardImage"
      }, /*#__PURE__*/React.createElement(TokenImage, {
        blockchain: 'solana',
        address: selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.token
      }), /*#__PURE__*/React.createElement("img", {
        className: "BlockchainLogo small bottomRight " + Blockchains['solana'].name,
        style: {
          backgroundColor: Blockchains['solana'].logoBackgroundColor
        },
        src: Blockchains['solana'].logo,
        alt: Blockchains['solana'].label,
        title: Blockchains['solana'].label
      })), /*#__PURE__*/React.createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardBodyWrapper"
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardText"
      }, /*#__PURE__*/React.createElement("div", {
        className: "TokenAmountRow"
      }, (selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.amount) && /*#__PURE__*/React.createElement("span", {
        className: "TokenAmountCell"
      }, format(selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.amount)), /*#__PURE__*/React.createElement("span", null, "\xA0"), (selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.symbol) && /*#__PURE__*/React.createElement("span", {
        className: "TokenSymbolCell"
      }, selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.symbol))), paymentValue && displayedPaymentValue != "".concat(selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.symbol, " ").concat(format(selectedPaymentOption === null || selectedPaymentOption === void 0 ? void 0 : selectedPaymentOption.amount)) && /*#__PURE__*/React.createElement("div", {
        className: "TokenAmountRow small Opacity05"
      }, /*#__PURE__*/React.createElement("span", {
        className: "TokenAmountCell"
      }, displayedPaymentValue)), !paymentValue && /*#__PURE__*/React.createElement("div", {
        className: "TokenAmountRow small"
      }, /*#__PURE__*/React.createElement("span", {
        className: "TokenAmountCell"
      }, /*#__PURE__*/React.createElement("div", {
        className: "Skeleton",
        style: {
          position: 'relative',
          marginTop: '2px',
          borderRadius: '10px',
          width: '82px',
          height: '15px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonBackground"
      })))))))))),
      footer: /*#__PURE__*/React.createElement("div", {
        className: "PaddingRightM PaddingLeftM PaddingBottomM"
      }, state === 'scan' && /*#__PURE__*/React.createElement("div", {
        className: "Opacity05 PaddingBottomXS PaddingTopS"
      }, /*#__PURE__*/React.createElement("small", null, "Scan QR code with your wallet")), state === 'pay' && validationState !== true && /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomS PaddingTopXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicator MarginBottomXS"
      }, /*#__PURE__*/React.createElement("img", {
        src: solanaPayWallet === null || solanaPayWallet === void 0 ? void 0 : solanaPayWallet.logo
      }), /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      })), /*#__PURE__*/React.createElement("div", {
        className: "TextCenter PaddingTopXS"
      }, /*#__PURE__*/React.createElement("span", {
        className: "FontSizeL"
      }, "Confirm in your wallet"))))), (state === 'succeeded' || validationState === true) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomS StepsWrapper"
      }, /*#__PURE__*/React.createElement("a", {
        href: transaction === null || transaction === void 0 ? void 0 : (_transaction$current = transaction.current) === null || _transaction$current === void 0 ? void 0 : _transaction$current.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "Step Card small transparent done ".concat(!synchronousTracking ? "active" : "")
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, "Perform payment"))), /*#__PURE__*/React.createElement("div", {
        className: "StepConnector"
      }), synchronousTracking && !release && /*#__PURE__*/React.createElement("div", {
        className: "Step Card small transparent active disabled"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ActionIndicatorSpinner"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, /*#__PURE__*/React.createElement(LoadingText, null, "Confirming payment")))), synchronousTracking && release && /*#__PURE__*/React.createElement("a", {
        href: transaction ? link({
          url: "https://scan.depay.com/tx/solana/".concat(transaction.current.id, "?sender=").concat(solanPayPayment.current.fromAddress, "&receiver=").concat(solanPayPayment.current.toAddress, "&deadline=").concat(solanPayPayment.current.deadline),
          target: '_blank',
          wallet: solanaPayWallet
        }) : undefined,
        target: "_blank",
        className: "Step Card small transparent active"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepIcon"
      }, /*#__PURE__*/React.createElement(CheckmarkIcon, {
        className: "small"
      })), /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, /*#__PURE__*/React.createElement("div", {
        className: "StepText"
      }, "Payment confirmed")))), (release || !synchronousTracking) && forwardTo && /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomXS"
      }, /*#__PURE__*/React.createElement("a", {
        className: "ButtonPrimary",
        href: forwardTo,
        rel: "noopener noreferrer"
      }, "Continue")), (release || !synchronousTracking) && !forwardTo && /*#__PURE__*/React.createElement("div", {
        className: "PaddingBottomXS"
      }, /*#__PURE__*/React.createElement("button", {
        className: "ButtonPrimary",
        onClick: close
      }, "Done")))))
    });
  }
});

var TrackingFailedDialog = (function () {
  var _useContext = useContext(PaymentTrackingContext),
      continueTryTracking = _useContext.continueTryTracking,
      transaction = _useContext.transaction;

  var _useContext2 = useContext(NavigateStackContext),
      navigate = _useContext2.navigate;

  var tryAgain = function tryAgain() {
    continueTryTracking();
    navigate('back');
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: false,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://support.depay.com?transaction=".concat(transaction === null || transaction === void 0 ? void 0 : transaction.id, "&query=").concat(encodeURIComponent("Tracking payment failed")),
      target: "_blank",
      className: "Card secondary small inlineBlock"
    }, "Contact support")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(ErrorGraphic, null)), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Tracking payment failed"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please ensure you are connected to the internet, then click \"Try again\"."), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("span", null, "If this keeps happening, please report it.")))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: tryAgain
    }, "Try again"))
  });
});

var ValidationFailedDialog = (function () {
  var _useContext = useContext(ClosableContext);
      _useContext.close;

  var _useContext2 = useContext(PaymentTrackingContext),
      transaction = _useContext2.transaction;

  var _useContext3 = useContext(WalletContext),
      account = _useContext3.account,
      wallet = _useContext3.wallet;

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: false,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }),
    body: /*#__PURE__*/React.createElement("div", {
      className: "TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement(ErrorGraphic, null)), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Validation failed"), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Confirming the payment failed.")), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please contact support.")))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("a", {
      href: "https://support.depay.com?wallet=".concat(encodeURIComponent(wallet === null || wallet === void 0 ? void 0 : wallet.name), "&account=").concat(account, "&transaction=").concat(transaction === null || transaction === void 0 ? void 0 : transaction.id, "&query=").concat(encodeURIComponent("Payment validation failed")),
      target: "_blank",
      className: "Card secondary small inlineBlock"
    }, "Contact support"))
  });
});

var WrongNetworkDialog = (function (props) {
  var _useContext = useContext(PaymentContext),
      payment = _useContext.payment;

  var _useContext2 = useContext(WalletContext),
      wallet = _useContext2.wallet;

  var _useContext3 = useContext(NavigateStackContext),
      navigate = _useContext3.navigate;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2);
      _useState2[0];
      _useState2[1];

  var blockchain = Blockchains.findByName(payment.route.blockchain);

  var switchNetwork = function switchNetwork() {
    wallet.switchTo(payment.blockchain);
    navigate('back');
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    stacked: true,
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Wrong Network")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomXS TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "GraphicWrapper"
    }, /*#__PURE__*/React.createElement("img", {
      className: "Graphic",
      src: blockchain.logoWhiteBackground
    })), /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL Text FontSizeL PaddingTopS FontWeightBold"
    }, "Connect to ", blockchain.label), /*#__PURE__*/React.createElement("div", {
      className: "Text PaddingTopS PaddingBottomS PaddingLeftS PaddingRightS"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "FontSizeM"
    }, "Please make sure you connect your wallet to the correct network before you try again!"))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "ButtonPrimary",
      onClick: switchNetwork
    }, "Switch Network"))
  });
});

var PaymentStack = (function (props) {
  var _useContext = useContext(ClosableContext),
      open = _useContext.open,
      close = _useContext.close;

  var _useContext2 = useContext(NavigateContext),
      _setNavigator = _useContext2.setNavigator;

  var _useContext3 = useContext(WalletContext),
      account = _useContext3.account,
      solanaPayWallet = _useContext3.solanaPayWallet;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      navigator = _useState2[0],
      setLocalNavigator = _useState2[1];

  useEffect(function () {
    if (navigator && !solanaPayWallet) {
      navigator.set(['PaymentOverview']);
    }
  }, [account, solanaPayWallet]);
  return /*#__PURE__*/React.createElement(ReactDialogStack, {
    setNavigator: function setNavigator(navigator) {
      setLocalNavigator(navigator);

      _setNavigator(navigator);
    },
    open: open,
    close: close,
    start: solanaPayWallet ? 'SolanaPay' : 'PaymentOverview',
    container: props.container,
    document: props.document,
    stacked: true,
    dialogs: {
      PaymentOverview: /*#__PURE__*/React.createElement(PaymentOverviewDialog, null),
      SolanaPay: /*#__PURE__*/React.createElement(SolanaPayDialog, null),
      ChangeAmount: /*#__PURE__*/React.createElement(ChangeAmountDialog, null),
      ChangeApproval: /*#__PURE__*/React.createElement(ChangeApprovalDialog, null),
      ChangePayment: /*#__PURE__*/React.createElement(ChangePaymentDialog, null),
      PaymentFailed: /*#__PURE__*/React.createElement(PaymentFailedDialog, null),
      WrongNetwork: /*#__PURE__*/React.createElement(WrongNetworkDialog, null),
      TrackingFailed: /*#__PURE__*/React.createElement(TrackingFailedDialog, null),
      TracingFailed: /*#__PURE__*/React.createElement(TracingFailedDialog, null),
      ValidationFailed: /*#__PURE__*/React.createElement(ValidationFailedDialog, null)
    }
  });
});

var PaymentTrackingProvider = (function (props) {
  var _useContext = useContext(ErrorContext);
      _useContext.errorCallback;

  var _useContext2 = useContext(ConfigurationContext),
      configurationId = _useContext2.id,
      trackConfiguration = _useContext2.track;
      _useContext2.integration;
      _useContext2.link;
      _useContext2.type;

  var _useContext3 = useContext(CallbackContext),
      callValidatedCallback = _useContext3.callValidatedCallback,
      callSucceededCallback = _useContext3.callSucceededCallback,
      callFailedCallback = _useContext3.callFailedCallback;

  var _useContext4 = useContext(WalletContext);
      _useContext4.account;
      var wallet = _useContext4.wallet,
      solanaPayWallet = _useContext4.solanaPayWallet;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      deadline = _useState2[0],
      setDeadline = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      transaction = _useState4[0],
      setTransaction = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      confirmationsRequired = _useState6[0],
      setConfirmationsRequired = _useState6[1];

  var _useState7 = useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      confirmationsPassed = _useState8[0],
      setConfirmationsPassed = _useState8[1];

  var _useState9 = useState(),
      _useState10 = _slicedToArray(_useState9, 2),
      afterBlock = _useState10[0],
      setAfterBlock = _useState10[1];

  var _useState11 = useState(),
      _useState12 = _slicedToArray(_useState11, 2);
      _useState12[0];
      _useState12[1];

  var _useState13 = useState(),
      _useState14 = _slicedToArray(_useState13, 2),
      paymentRoute = _useState14[0],
      setPaymentRoute = _useState14[1];

  var _useState15 = useState(),
      _useState16 = _slicedToArray(_useState15, 2),
      attemptId = _useState16[0],
      setAttemptId = _useState16[1];

  var attemptIdRef = useRef(attemptId);
  attemptIdRef.current = attemptId;

  var _useState17 = useState(false),
      _useState18 = _slicedToArray(_useState17, 2),
      trackingInitialized = _useState18[0],
      setTrackingInitialized = _useState18[1];

  var _useState19 = useState(!!configurationId || !!(trackConfiguration && (trackConfiguration.endpoint || typeof trackConfiguration.method == 'function') && trackConfiguration.async != true)),
      _useState20 = _slicedToArray(_useState19, 1),
      synchronousTracking = _useState20[0];

  var _useState21 = useState(!configurationId && !!(trackConfiguration && trackConfiguration.async == true)),
      _useState22 = _slicedToArray(_useState21, 1),
      asynchronousTracking = _useState22[0];

  var _useState23 = useState(!!configurationId || !!(trackConfiguration && trackConfiguration.poll && (trackConfiguration.poll.endpoint || typeof trackConfiguration.poll.method == 'function') && trackConfiguration.async != true)),
      _useState24 = _slicedToArray(_useState23, 1),
      polling = _useState24[0];

  var _useState25 = useState(false),
      _useState26 = _slicedToArray(_useState25, 2),
      release = _useState26[0],
      setRelease = _useState26[1];

  var _useState27 = useState(),
      _useState28 = _slicedToArray(_useState27, 2),
      validationState = _useState28[0];
      _useState28[1];

  var _useState29 = useState(),
      _useState30 = _slicedToArray(_useState29, 2),
      forwardTo = _useState30[0],
      setForwardTo = _useState30[1];

  var _useContext5 = useContext(ClosableContext),
      setClosable = _useContext5.setClosable;

  var _useContext6 = useContext(NavigateContext),
      navigate = _useContext6.navigate,
      set = _useContext6.set;

  var validationSocket = useRef();
  var processValidationSocketMessage = useEvent(function (eventData, socket) {
    if (eventData !== null && eventData !== void 0 && eventData.message) {
      if (eventData.message.confirmations) {
        setConfirmationsRequired(eventData.message.confirmations.required);
        setConfirmationsPassed(eventData.message.confirmations.passed);
      }

      if (eventData.message.status) {
        var success = eventData.message.status == 'success';

        if (eventData.message.release) {
          socket.close(1000);

          if (success) {
            callSucceededCallback(transaction, paymentRoute);
            callValidatedCallback(transaction, paymentRoute);
            setClosable(true);
            setRelease(true);
            setForwardTo(eventData.message.forward_to);
          } else if (success == false) {
            if (eventData.message.failed_reason === undefined || eventData.message.failed_reason === 'FAILED') {
              setClosable(true);
              callFailedCallback(transaction, paymentRoute);
              set(['PaymentFailed']);
            } else {
              setClosable(false);
              set(['ValidationFailed']);
            }
          }
        }
      }
    }
  });

  var openValidationSocket = function openValidationSocket(paymentRoute, deadline) {
    if (validationSocket.current) {
      return;
    }

    var identifier = JSON.stringify({
      blockchain: paymentRoute.blockchain,
      sender: paymentRoute.fromAddress,
      receiver: paymentRoute.toAddress,
      deadline: deadline,
      channel: 'PaymentChannel'
    });
    validationSocket.current = openManagedSocket({
      identifier: identifier,
      onopen: function onopen() {
        return {
          command: 'subscribe',
          identifier: identifier
        };
      },
      onmessage: processValidationSocketMessage,
      keepAlive: {
        interval: 3000,
        callback: function callback() {
          return {
            type: "ping",
            message: Math.floor(Date.now() / 1000)
          };
        }
      }
    });
  };

  var retryStartTracking = function retryStartTracking(transaction, afterBlock, paymentRoute, deadline, attempt) {
    attempt = parseInt(attempt || 1, 10);

    if (attempt < 10) {
      setTimeout(function () {
        startTracking(transaction, afterBlock, paymentRoute, deadline, attempt + 1);
      }, 2000);
    } else {
      navigate('TrackingFailed');
    }
  };

  var continueTryTracking = function continueTryTracking() {
    retryStartTracking(transaction, afterBlock, paymentRoute, deadline, 1);
  };

  var callTracking = function callTracking(payment) {
    if (configurationId) {
      return fetch("https://public.depay.com/configurations/".concat(configurationId, "/attempts"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
      }).then(function (response) {
        if (response.status == 200 || response.status == 201) {
          response.json().then(function (attempt) {
            return setAttemptId(attempt.id);
          });
          return response;
        } else {
          return reject('TRACKING REQUEST FAILED');
        }
      });
    } else if (trackConfiguration.endpoint) {
      return fetch(trackConfiguration.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payment)
      }).then(function (response) {
        if (response.status == 200 || response.status == 201) {
          return response;
        } else {
          throw response;
        }
      });
    } else if (trackConfiguration.method) {
      return trackConfiguration.method(payment);
    } else {
      throw 'No tracking defined!';
    }
  };

  var startTracking = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(transaction, afterBlock, paymentRoute, deadline, attempt) {
      var _paymentRoute$protoco, _paymentRoute$feeAmou, _paymentRoute$fee, _paymentRoute$feeAmou2, _paymentRoute$fee2;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              callTracking({
                blockchain: transaction.blockchain,
                transaction: transaction.id,
                sender: paymentRoute.fromAddress,
                after_block: afterBlock.toString(),
                from_token: paymentRoute.fromToken.address,
                from_amount: paymentRoute.fromAmount.toString(),
                from_decimals: paymentRoute.fromDecimals,
                to_token: paymentRoute.toToken.address,
                to_amount: paymentRoute.toAmount.toString(),
                to_decimals: paymentRoute.toDecimals,
                protocol_fee_amount: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$protoco = paymentRoute.protocolFeeAmount) === null || _paymentRoute$protoco === void 0 ? void 0 : _paymentRoute$protoco.toString(),
                fee_amount: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$feeAmou = paymentRoute.feeAmount) === null || _paymentRoute$feeAmou === void 0 ? void 0 : _paymentRoute$feeAmou.toString(),
                fee_receiver: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$fee = paymentRoute.fee) === null || _paymentRoute$fee === void 0 ? void 0 : _paymentRoute$fee.receiver,
                fee2_amount: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$feeAmou2 = paymentRoute.feeAmount2) === null || _paymentRoute$feeAmou2 === void 0 ? void 0 : _paymentRoute$feeAmou2.toString(),
                fee2_receiver: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$fee2 = paymentRoute.fee2) === null || _paymentRoute$fee2 === void 0 ? void 0 : _paymentRoute$fee2.receiver,
                trace_attempt_id: attemptIdRef.current,
                deadline: deadline,
                selected_wallet: (wallet === null || wallet === void 0 ? void 0 : wallet.name) || (solanaPayWallet === null || solanaPayWallet === void 0 ? void 0 : solanaPayWallet.name)
              }).then(function (response) {
                setTrackingInitialized(true);
              })["catch"](function (error) {
                retryStartTracking(transaction, afterBlock, paymentRoute, deadline, attempt);
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function startTracking(_x, _x2, _x3, _x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }();

  var handlePollingResponse = useEvent(function (data, pollingInterval) {
    if (data && data.forward_to) {
      setClosable(true);
      setForwardTo(data.forward_to);
    } else {
      setClosable(true);
    }

    clearInterval(pollingInterval);

    if (data && data.failed_reason && data.failed_reason != 'FAILED') {
      setClosable(false);
      set(['ValidationFailed']);
    } else {
      if ((data === null || data === void 0 ? void 0 : data.status) == 'failed') {
        setClosable(true);
        callFailedCallback(transaction, paymentRoute);
        set(['PaymentFailed']);
      } else if (data === undefined || (data === null || data === void 0 ? void 0 : data.status) == 'success') {
        callSucceededCallback(transaction, paymentRoute);
        callValidatedCallback(transaction, paymentRoute);
        setClosable(true);
        setRelease(true);
      }
    }
  });

  var pollStatus = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(polling, transaction, afterBlock, paymentRoute, pollingInterval, attemptId, deadline) {
      var performedPayment;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!polling || transaction == undefined || afterBlock == undefined || paymentRoute == undefined)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              performedPayment = {
                blockchain: transaction.blockchain,
                transaction: transaction.id,
                sender: transaction.from,
                receiver: paymentRoute.toAddress,
                deadline: deadline,
                after_block: afterBlock.toString(),
                to_token: paymentRoute.toToken.address
              };

              if (configurationId) {
                if (attemptId) {
                  fetch("https://public.depay.com/attempts/".concat(attemptId), {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  }).then(function (response) {
                    if (response.status == 200 || response.status == 201) {
                      response.json().then(function (data) {
                        return handlePollingResponse(data, pollingInterval);
                      });
                    } else {
                      return undefined;
                    }
                  });
                }
              } else if (trackConfiguration.poll.endpoint) {
                fetch(trackConfiguration.poll.endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(performedPayment)
                }).then(function (response) {
                  if (response.status == 200 || response.status == 201) {
                    response.json().then(function (data) {
                      return handlePollingResponse(data, pollingInterval);
                    })["catch"](function () {
                      setClosable(true);
                    });
                  } else {
                    return undefined;
                  }
                });
              } else if (trackConfiguration.poll.method) {
                trackConfiguration.poll.method(performedPayment).then(function (data) {
                  if (data) {
                    handlePollingResponse(data, pollingInterval);
                  }
                });
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function pollStatus(_x6, _x7, _x8, _x9, _x10, _x11, _x12) {
      return _ref2.apply(this, arguments);
    };
  }();

  useEffect(function () {
    if (forwardTo) {
      props.document.location.href = forwardTo;
    }
  }, [forwardTo]);
  useEffect(function () {
    if (!polling) {
      return;
    }

    if (!synchronousTracking) {
      return;
    }

    var pollingInterval = setInterval(function () {
      return pollStatus(polling, transaction, afterBlock, paymentRoute, pollingInterval, attemptId, deadline);
    }, 5000);
    return function () {
      clearInterval(pollingInterval);
    };
  }, [polling, transaction, afterBlock, attemptId, paymentRoute]);

  var track = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(transaction, afterBlock, paymentRoute, deadline) {
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (synchronousTracking || trackConfiguration && trackConfiguration.async == true) {
                startTracking(transaction, afterBlock, paymentRoute, deadline);
              }

              if (!(synchronousTracking == false)) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return");

            case 3:
              setDeadline(deadline);
              setTransaction(transaction);
              setAfterBlock(afterBlock);
              setPaymentRoute(paymentRoute);
              openValidationSocket(paymentRoute, deadline);

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function track(_x13, _x14, _x15, _x16) {
      return _ref3.apply(this, arguments);
    };
  }();

  var trace = function trace(afterBlock, paymentRoute, deadline) {
    setAttemptId(); // reset attemptId in case payment is retried

    if (!synchronousTracking && !asynchronousTracking) {
      return Promise.resolve();
    }

    setDeadline(deadline);
    setAfterBlock(afterBlock);
    setPaymentRoute(paymentRoute);
    openValidationSocket(paymentRoute, deadline);
    return new Promise( /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(resolve, reject) {
        var _paymentRoute$protoco2, _paymentRoute$feeAmou3, _paymentRoute$fee3, _paymentRoute$feeAmou4, _paymentRoute$fee4;

        var performedPayment;
        return regenerator.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                performedPayment = {
                  blockchain: paymentRoute.blockchain,
                  sender: paymentRoute.fromAddress,
                  after_block: afterBlock.toString(),
                  from_token: paymentRoute.fromToken.address,
                  from_amount: paymentRoute.fromAmount.toString(),
                  from_decimals: paymentRoute.fromDecimals,
                  to_token: paymentRoute.toToken.address,
                  to_amount: paymentRoute.toAmount.toString(),
                  to_decimals: paymentRoute.toDecimals,
                  protocol_fee_amount: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$protoco2 = paymentRoute.protocolFeeAmount) === null || _paymentRoute$protoco2 === void 0 ? void 0 : _paymentRoute$protoco2.toString(),
                  fee_amount: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$feeAmou3 = paymentRoute.feeAmount) === null || _paymentRoute$feeAmou3 === void 0 ? void 0 : _paymentRoute$feeAmou3.toString(),
                  fee_receiver: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$fee3 = paymentRoute.fee) === null || _paymentRoute$fee3 === void 0 ? void 0 : _paymentRoute$fee3.receiver,
                  fee2_amount: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$feeAmou4 = paymentRoute.feeAmount2) === null || _paymentRoute$feeAmou4 === void 0 ? void 0 : _paymentRoute$feeAmou4.toString(),
                  fee2_receiver: paymentRoute === null || paymentRoute === void 0 ? void 0 : (_paymentRoute$fee4 = paymentRoute.fee2) === null || _paymentRoute$fee4 === void 0 ? void 0 : _paymentRoute$fee4.receiver,
                  deadline: deadline,
                  selected_wallet: (wallet === null || wallet === void 0 ? void 0 : wallet.name) || (solanaPayWallet === null || solanaPayWallet === void 0 ? void 0 : solanaPayWallet.name)
                };

                if (!configurationId) {
                  _context4.next = 5;
                  break;
                }

                return _context4.abrupt("return", fetch("https://public.depay.com/configurations/".concat(configurationId, "/attempts"), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(performedPayment)
                }).then(function (response) {
                  if (response.status == 200 || response.status == 201) {
                    response.json().then(function (attempt) {
                      return setAttemptId(attempt.id);
                    });
                    return resolve();
                  } else {
                    return reject('TRACING REQUEST FAILED');
                  }
                }));

              case 5:
                if (!trackConfiguration.endpoint) {
                  _context4.next = 9;
                  break;
                }

                return _context4.abrupt("return", fetch(trackConfiguration.endpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(performedPayment)
                }).then(function (response) {
                  if (response.status == 200 || response.status == 201) {
                    return resolve();
                  } else {
                    return reject('TRACING REQUEST FAILED');
                  }
                }));

              case 9:
                if (trackConfiguration.method) {
                  trackConfiguration.method(performedPayment).then(resolve)["catch"](reject);
                } else {
                  reject('No tracking defined!');
                }

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x17, _x18) {
        return _ref4.apply(this, arguments);
      };
    }());
  };

  return /*#__PURE__*/React.createElement(PaymentTrackingContext.Provider, {
    value: {
      synchronousTracking: synchronousTracking,
      asynchronousTracking: asynchronousTracking,
      transaction: transaction,
      setTransaction: setTransaction,
      track: track,
      trace: trace,
      trackingInitialized: trackingInitialized,
      continueTryTracking: continueTryTracking,
      release: release,
      validationState: validationState,
      forwardTo: forwardTo,
      confirmationsRequired: confirmationsRequired,
      confirmationsPassed: confirmationsPassed
    }
  }, props.children);
});

var usdAmountForToken = /*#__PURE__*/(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
    var blockchain, token, amount, decimals, _decimals, amountDecimal, response;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            blockchain = _ref.blockchain, token = _ref.token, amount = _ref.amount, decimals = _ref.decimals;

            if (!Blockchains[blockchain].stables.usd.includes(token)) {
              _context.next = 4;
              break;
            }

            // is stable
            _decimals = Blockchains[blockchain].tokens.find(function (tokenData) {
              return tokenData.address === token;
            }).decimals;
            return _context.abrupt("return", ethers.utils.formatUnits(amount.toString(), _decimals));

          case 4:
            amountDecimal = ethers.utils.formatUnits(amount, decimals);
            _context.next = 7;
            return fetch("https://public.depay.com/conversions/USD/".concat(blockchain, "/").concat(token, "?amount=").concat(amountDecimal));

          case 7:
            response = _context.sent;

            if (!(response.status == 200)) {
              _context.next = 14;
              break;
            }

            _context.t0 = parseFloat;
            _context.next = 12;
            return response.text();

          case 12:
            _context.t1 = _context.sent;
            return _context.abrupt("return", (0, _context.t0)(_context.t1));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})();

var PaymentValueProvider = (function (props) {
  var _useContext = useContext(UpdatableContext),
      updatable = _useContext.updatable;

  var _useContext2 = useContext(ConfigurationContext),
      configuredAmount = _useContext2.amount,
      currencyCode = _useContext2.currencyCode;

  var _useContext3 = useContext(ChangableAmountContext),
      amount = _useContext3.amount;

  var _useContext4 = useContext(PaymentContext),
      payment = _useContext4.payment;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      paymentValue = _useState2[0],
      setPaymentValue = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      displayedPaymentValue = _useState4[0],
      setDisplayedPaymentValue = _useState4[1];

  var _useContext5 = useContext(ConfigurationContext),
      currency = _useContext5.currency;

  var updatePaymentValue = function updatePaymentValue(_ref) {
    var updatable = _ref.updatable,
        payment = _ref.payment;

    if (updatable == false || (payment === null || payment === void 0 ? void 0 : payment.route) == undefined) {
      return;
    }

    setPaymentValue(null);
    usdAmountForToken({
      blockchain: payment.route.blockchain,
      token: payment.route.fromToken.address,
      amount: payment.route.fromAmount,
      decimals: payment.route.fromDecimals
    }).then(function (usdAmount) {
      if (usdAmount != undefined && usdAmount != null) {
        Currency.fromUSD({
          amount: usdAmount,
          code: currency
        }).then(setPaymentValue);
      }
    });
  };

  useEffect(function () {
    if (paymentValue && amount && configuredAmount && configuredAmount.fix) {
      setDisplayedPaymentValue(paymentValue.toString());
    } else if (amount && (configuredAmount == undefined || (configuredAmount === null || configuredAmount === void 0 ? void 0 : configuredAmount.token) != true)) {
      setDisplayedPaymentValue(new Currency({
        amount: amount.toFixed(2),
        code: currencyCode
      }).toString());
    } else if (paymentValue && paymentValue.toString().length && (configuredAmount === null || configuredAmount === void 0 ? void 0 : configuredAmount.token) != true) {
      setDisplayedPaymentValue(paymentValue.toString());
    } else if (payment) {
      setDisplayedPaymentValue("".concat(payment.symbol, " ").concat(payment.amount));
    }
  }, [paymentValue, payment, amount, configuredAmount]);
  useEffect(function () {
    if (payment) {
      updatePaymentValue({
        updatable: updatable,
        payment: payment
      });
    }
  }, [updatable, payment]);
  return /*#__PURE__*/React.createElement(PaymentValueContext.Provider, {
    value: {
      paymentValue: paymentValue,
      displayedPaymentValue: displayedPaymentValue
    }
  }, props.children);
});

var SUPPORTED_CURRENCIES = ["all", "xcd", "eur", "bbd", "btn", "bnd", "xaf", "cup", "usd", "fkp", "gip", "huf", "irr", "jmd", "aud", "lak", "lyd", "mkd", "xof", "nzd", "omr", "pgk", "rwf", "wst", "rsd", "sek", "tzs", "amd", "bsd", "bam", "cve", "cny", "crc", "czk", "ern", "gel", "htg", "inr", "jod", "krw", "lbp", "mwk", "mru", "mzn", "ang", "pen", "qar", "std", "sll", "sos", "sdg", "syp", "aoa", "awg", "bhd", "bzd", "bwp", "bif", "kyd", "cop", "dkk", "gtq", "hnl", "idr", "ils", "kzt", "kwd", "lsl", "myr", "mur", "mnt", "mmk", "ngn", "pab", "php", "ron", "sar", "sgd", "zar", "srd", "twd", "top", "vef", "dzd", "ars", "azn", "bob", "bgn", "cad", "clp", "cdf", "dop", "fjd", "gmd", "gyd", "isk", "iqd", "jpy", "kpw", "chf", "mga", "mdl", "mad", "npr", "nio", "pkr", "pyg", "shp", "scr", "sbd", "lkr", "thb", "try", "aed", "vuv", "yer", "afn", "bdt", "brl", "khr", "kmf", "hrk", "djf", "egp", "etb", "xpf", "ghs", "gnf", "hkd", "xdr", "kes", "kgs", "lrd", "mop", "mvr", "mxn", "nad", "nok", "pln", "rub", "szl", "tjs", "ttd", "ugx", "uyu", "vnd", "tnd", "uah", "uzs", "tmt", "gbp", "zmw", "byn", "bmd", "ggp", "clf", "cuc", "imp", "jep", "svc", "xag", "zwl"];

var preflight$1 = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
    var accept, integration;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            accept = _ref.accept, integration = _ref.integration;

            if (!(typeof integration !== 'undefined' && typeof accept !== 'undefined')) {
              _context.next = 3;
              break;
            }

            throw 'You can either use `integration` or `accept`, but not both!';

          case 3:
            if (!integration) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            accept.forEach(function (configuration) {
              if (typeof configuration.blockchain === 'undefined') {
                throw 'You need to set the blockchain you want to receive the payment on!';
              }

              if (!supported.includes(configuration.blockchain)) {
                throw 'You need to set a supported blockchain!';
              }

              if (typeof configuration.token === 'undefined' && typeof configuration.fromToken === 'undefined' && typeof configuration.fromAmount === 'undefined' && typeof configuration.toToken === 'undefined') {
                throw 'You need to set the token you want to receive as payment!';
              }

              if (typeof configuration.token === 'undefined' && typeof configuration.fromToken !== 'undefined' && typeof configuration.fromAmount === 'undefined' && typeof configuration.toToken === 'undefined') {
                throw 'You need to set the fromToken, fromAmount and toToken!';
              }

              if (typeof configuration.receiver === 'undefined') {
                throw 'You need to set the receiver address that you want to receive the payment!';
              }
            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function preflight(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var Payment = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_ref3) {
    var accept, amount, sent, succeeded, validated, failed, error, critical, style, allow, deny, whitelist, blacklist, providers, currency, connected, closed, track, closable, integration, payload, link, container, before, wallet, title, action, document, wallets, protocolFee, unmount;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            accept = _ref3.accept, amount = _ref3.amount, sent = _ref3.sent, succeeded = _ref3.succeeded, validated = _ref3.validated, failed = _ref3.failed, error = _ref3.error, critical = _ref3.critical, style = _ref3.style, allow = _ref3.allow, deny = _ref3.deny, whitelist = _ref3.whitelist, blacklist = _ref3.blacklist, providers = _ref3.providers, currency = _ref3.currency, connected = _ref3.connected, closed = _ref3.closed, track = _ref3.track, closable = _ref3.closable, integration = _ref3.integration, payload = _ref3.payload, link = _ref3.link, container = _ref3.container, before = _ref3.before, wallet = _ref3.wallet, title = _ref3.title, action = _ref3.action, document = _ref3.document, wallets = _ref3.wallets, protocolFee = _ref3.protocolFee;
            requireReactVersion();

            if (currency && !SUPPORTED_CURRENCIES.includes(currency.toLowerCase())) {
              currency = false;
            }

            _context2.prev = 3;
            _context2.next = 6;
            return preflight$1({
              accept: accept,
              integration: integration
            });

          case 6:
            if (typeof window._depayUnmountLoading == 'function') {
              window._depayUnmountLoading();
            }

            unmount = mount({
              style: style,
              container: container,
              document: ensureDocument(document),
              closed: closed
            }, function (unmount) {
              return function (container) {
                return /*#__PURE__*/React.createElement(ErrorProvider, {
                  errorCallback: error,
                  container: container,
                  unmount: unmount
                }, /*#__PURE__*/React.createElement(ConfigurationProvider, {
                  unmount: unmount,
                  document: document,
                  container: container,
                  configuration: {
                    type: 'payment',
                    payload: payload,
                    before: before,
                    amount: amount,
                    accept: accept,
                    currency: currency,
                    event: event,
                    sent: sent,
                    succeeded: succeeded,
                    validated: validated,
                    failed: failed,
                    allow: allow,
                    deny: deny,
                    whitelist: whitelist,
                    blacklist: blacklist,
                    providers: providers,
                    track: track,
                    integration: integration,
                    link: link,
                    wallet: wallet,
                    title: title,
                    action: action,
                    wallets: wallets,
                    protocolFee: protocolFee
                  }
                }, /*#__PURE__*/React.createElement(CallbackProvider, null, /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
                  unmount: unmount,
                  closable: closable
                }, /*#__PURE__*/React.createElement(NavigateProvider, null, /*#__PURE__*/React.createElement(WalletProvider, {
                  document: document,
                  container: container,
                  connected: connected,
                  unmount: unmount
                }, /*#__PURE__*/React.createElement(ConversionRateProvider, null, /*#__PURE__*/React.createElement(ChangableAmountProvider, null, /*#__PURE__*/React.createElement(PaymentAmountRoutingProvider, {
                  container: container,
                  document: document
                }, /*#__PURE__*/React.createElement(PaymentTrackingProvider, {
                  document: ensureDocument(document)
                }, /*#__PURE__*/React.createElement(PaymentProvider, {
                  container: container,
                  document: document
                }, /*#__PURE__*/React.createElement(PaymentValueProvider, null, /*#__PURE__*/React.createElement(PaymentStack, {
                  document: document,
                  container: container
                }), /*#__PURE__*/React.createElement(PoweredBy, null))))))))))))));
              };
            });
            return _context2.abrupt("return", {
              unmount: unmount
            });

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](3);
            console.log('critical error', _context2.t0);

            if (critical != undefined) {
              critical(_context2.t0);
            }

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[3, 11]]);
  }));

  return function Payment(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var SaleRoutingContext = /*#__PURE__*/React.createContext();

var ToTokenContext = /*#__PURE__*/React.createContext();

var ToTokenProvider = (function (props) {
  var _useContext = useContext(PaymentContext),
      payment = _useContext.payment;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      toToken = _useState2[0],
      setToToken = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      toTokenReadableAmount = _useState4[0],
      setToTokenReadableAmount = _useState4[1];

  useEffect(function () {
    if (payment) {
      Promise.all([payment.route.toToken.symbol(), payment.route.toToken.readable(payment.route.toAmount)]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            symbol = _ref2[0],
            readableAmount = _ref2[1];

        setToToken({
          address: payment.route.toToken.address,
          symbol: symbol
        });
        setToTokenReadableAmount(readableAmount);
      });
    }
  }, [payment]);
  return /*#__PURE__*/React.createElement(ToTokenContext.Provider, {
    value: {
      toToken: toToken,
      toTokenReadableAmount: toTokenReadableAmount
    }
  }, props.children);
});

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var SaleRoutingProvider = (function (props) {
  var _useContext = useContext(ChangableAmountContext),
      acceptWithAmount = _useContext.acceptWithAmount;

  var _useContext2 = useContext(ConfigurationContext);
      _useContext2.sell;

  var _useContext3 = useContext(WalletContext),
      account = _useContext3.account;

  var _useState = useState(acceptWithAmount ? acceptWithAmount.map(function (accept) {
    return _objectSpread$1(_objectSpread$1({}, accept), {}, {
      receiver: account
    });
  }) : undefined),
      _useState2 = _slicedToArray(_useState, 2),
      acceptWithAmountAndReceiver = _useState2[0],
      setAcceptWithAmountAndReceiver = _useState2[1];

  useEffect(function () {
    if (acceptWithAmount) {
      setAcceptWithAmountAndReceiver(acceptWithAmount.map(function (accept) {
        return _objectSpread$1(_objectSpread$1({}, accept), {}, {
          receiver: account
        });
      }));
    } else {
      setAcceptWithAmountAndReceiver();
    }
  }, [acceptWithAmount]);
  return /*#__PURE__*/React.createElement(SaleRoutingContext.Provider, {
    value: {}
  }, /*#__PURE__*/React.createElement(PaymentRoutingProvider, {
    accept: acceptWithAmountAndReceiver
  }, /*#__PURE__*/React.createElement(PaymentProvider, {
    container: props.container,
    document: props.document
  }, /*#__PURE__*/React.createElement(PaymentValueProvider, null, /*#__PURE__*/React.createElement(ToTokenProvider, null, props.children)))));
});

var SaleOverviewSkeleton = (function (props) {
  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Buy")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton",
      style: {
        height: '100px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })), /*#__PURE__*/React.createElement("div", {
      className: "Card Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonWrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "ButtonPrimary Skeleton"
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    }))))
  });
});

var SaleOverviewDialog = (function (props) {
  var _useContext = useContext(ChangableAmountContext);
      _useContext.amount;

  var _useContext2 = useContext(ConfigurationContext),
      tokenImage = _useContext2.tokenImage,
      amountConfiguration = _useContext2.amount;

  var _useContext3 = useContext(PaymentValueContext),
      paymentValue = _useContext3.paymentValue,
      displayedPaymentValue = _useContext3.displayedPaymentValue;

  var _useContext4 = useContext(PaymentContext),
      payment = _useContext4.payment,
      paymentState = _useContext4.paymentState;

  var _useContext5 = useContext(NavigateStackContext),
      navigate = _useContext5.navigate;

  var _useContext6 = useContext(ToTokenContext),
      toToken = _useContext6.toToken,
      toTokenReadableAmount = _useContext6.toTokenReadableAmount;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      salePerTokenValue = _useState2[0],
      setSalePerTokenValue = _useState2[1];

  useEffect(function () {
    if (paymentValue && (amountConfiguration == undefined || amountConfiguration.token != true) && toTokenReadableAmount) {
      var UsdAmountPerToken = paymentValue.amount / parseFloat(toTokenReadableAmount);
      var readableLocalizedAmountPerToken = new Currency({
        amount: UsdAmountPerToken,
        code: paymentValue.code
      }).toString();
      var zero = new Currency({
        amount: 0,
        code: paymentValue.code
      }).toString();

      if (readableLocalizedAmountPerToken != zero) {
        setSalePerTokenValue(readableLocalizedAmountPerToken);
      }
    }
  }, [paymentValue, toTokenReadableAmount]);

  if (toToken == undefined || toTokenReadableAmount == undefined || payment == undefined || paymentValue == undefined) {
    return /*#__PURE__*/React.createElement(SaleOverviewSkeleton, null);
  }

  var tokenImageElement;

  if (tokenImage) {
    tokenImageElement = /*#__PURE__*/React.createElement("img", {
      src: tokenImage
    });
  } else {
    tokenImageElement = /*#__PURE__*/React.createElement(TokenImage, {
      blockchain: payment.route.blockchain,
      address: toToken.address
    });
  }

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Buy")),
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: ["Card", paymentState == 'initialized' && (!amountConfiguration || !amountConfiguration.fix) ? '' : 'disabled'].join(' '),
      title: paymentState == 'initialized' ? "Change amount" : undefined,
      onClick: function onClick() {
        if (paymentState != 'initialized') {
          return;
        }

        if (amountConfiguration && amountConfiguration.fix) {
          return;
        }

        navigate('ChangeAmount');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage",
      title: payment.name
    }, tokenImageElement, /*#__PURE__*/React.createElement("img", {
      className: "BlockchainLogo small bottomRight " + payment.blockchain.name,
      style: {
        backgroundColor: payment.blockchain.logoBackgroundColor
      },
      src: payment.blockchain.logo,
      alt: payment.blockchain.label,
      title: payment.blockchain.label
    })), /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "CardTitle"
    }, "Amount"), /*#__PURE__*/React.createElement("div", {
      className: "CardText"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenSymbolCell"
    }, toToken.symbol), /*#__PURE__*/React.createElement("span", null, "\xA0"), /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, format(toTokenReadableAmount))), salePerTokenValue && /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow small Opacity05"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, salePerTokenValue, " per token"))))), /*#__PURE__*/React.createElement("div", {
      className: "CardAction"
    }, (!amountConfiguration || !amountConfiguration.fix) && /*#__PURE__*/React.createElement(ChevronRightIcon, null))), /*#__PURE__*/React.createElement("div", {
      className: ["Card", paymentState == 'initialized' ? '' : 'disabled'].join(' '),
      title: paymentState == 'initialized' ? "Payment options" : undefined,
      onClick: function onClick() {
        if (paymentState != 'initialized') {
          return;
        }

        navigate('ChangePayment');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage",
      title: payment.name
    }, /*#__PURE__*/React.createElement(TokenImage, {
      blockchain: payment.route.blockchain,
      address: payment.token
    })), /*#__PURE__*/React.createElement("div", {
      className: "CardBody"
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardBodyWrapper"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "CardTitle"
    }, "Payment"), /*#__PURE__*/React.createElement("h2", {
      className: "CardText"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenSymbolCell"
    }, payment.symbol), /*#__PURE__*/React.createElement("span", null, "\xA0"), /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, format(payment.amount))), /*#__PURE__*/React.createElement("div", {
      className: "TokenAmountRow small Opacity05"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TokenAmountCell"
    }, displayedPaymentValue))))), /*#__PURE__*/React.createElement("div", {
      className: "CardAction"
    }, /*#__PURE__*/React.createElement(ChevronRightIcon, null)))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement(Footer, null))
  });
});

var SaleStack = (function (props) {
  var _useContext = useContext(ClosableContext),
      open = _useContext.open,
      close = _useContext.close;

  var _useContext2 = useContext(NavigateContext),
      setNavigator = _useContext2.setNavigator;

  return /*#__PURE__*/React.createElement(ReactDialogStack, {
    setNavigator: setNavigator,
    open: open,
    close: close,
    start: "SaleOverview",
    container: props.container,
    document: props.document,
    stacked: true,
    dialogs: {
      SaleOverview: /*#__PURE__*/React.createElement(SaleOverviewDialog, null),
      ChangeAmount: /*#__PURE__*/React.createElement(ChangeAmountDialog, null),
      ChangeApproval: /*#__PURE__*/React.createElement(ChangeApprovalDialog, null),
      ChangePayment: /*#__PURE__*/React.createElement(ChangePaymentDialog, null),
      NoPaymentOptionFound: /*#__PURE__*/React.createElement(NoPaymentOptionFoundDialog, null),
      PaymentFailed: /*#__PURE__*/React.createElement(PaymentFailedDialog, null),
      WrongNetwork: /*#__PURE__*/React.createElement(WrongNetworkDialog, null)
    }
  });
});

var preflight = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(_ref) {
    var sell;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sell = _ref.sell;

            if (!(_typeof(sell) != 'object')) {
              _context.next = 3;
              break;
            }

            throw 'You need to configure at least 1 "blockchain": "token"';

          case 3:
            if (!(Object.keys(sell).length == 0)) {
              _context.next = 5;
              break;
            }

            throw 'You need to configure at least 1 "blockchain": "token"';

          case 5:
            if (!(Object.values(sell).length == 0)) {
              _context.next = 7;
              break;
            }

            throw 'You need to configure at least 1 "blockchain": "token"';

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function preflight(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var Sale = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(_ref3) {
    var amount, sell, sent, succeeded, failed, error, critical, style, deny, blacklist, before, providers, currency, connected, closed, tokenImage, closable, integration, wallet, document, accept, unmount;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            amount = _ref3.amount, sell = _ref3.sell, sent = _ref3.sent, succeeded = _ref3.succeeded, failed = _ref3.failed, error = _ref3.error, critical = _ref3.critical, style = _ref3.style, deny = _ref3.deny, blacklist = _ref3.blacklist, before = _ref3.before, providers = _ref3.providers, currency = _ref3.currency, connected = _ref3.connected, closed = _ref3.closed, tokenImage = _ref3.tokenImage, closable = _ref3.closable, integration = _ref3.integration, wallet = _ref3.wallet, document = _ref3.document;
            requireReactVersion();
            _context2.prev = 2;
            _context2.next = 5;
            return preflight({
              sell: sell
            });

          case 5:
            accept = Object.keys(sell).map(function (key) {
              return {
                blockchain: key,
                token: sell[key]
              };
            });
            deny = Object.assign(deny || {});
            Object.keys(sell).forEach(function (key) {
              if (!deny[key]) {
                deny[key] = [];
              }

              deny[key].push(sell[key]);
              deny[key] = _toConsumableArray(new Set(deny[key]));
            });
            unmount = mount({
              style: style,
              document: ensureDocument(document),
              closed: closed
            }, function (unmount) {
              return function (container) {
                return /*#__PURE__*/React.createElement(ErrorProvider, {
                  errorCallback: error,
                  container: container,
                  unmount: unmount
                }, /*#__PURE__*/React.createElement(ConfigurationProvider, {
                  configuration: {
                    type: 'sale',
                    accept: accept,
                    before: before,
                    tokenImage: tokenImage,
                    amount: amount,
                    sell: sell,
                    currency: currency,
                    sent: sent,
                    succeeded: succeeded,
                    failed: failed,
                    deny: deny,
                    blacklist: blacklist,
                    providers: providers,
                    integration: integration,
                    wallet: wallet
                  }
                }, /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
                  unmount: unmount,
                  closable: closable
                }, /*#__PURE__*/React.createElement(WalletProvider, {
                  container: container,
                  connected: connected,
                  unmount: unmount
                }, /*#__PURE__*/React.createElement(NavigateProvider, null, /*#__PURE__*/React.createElement(ConversionRateProvider, null, /*#__PURE__*/React.createElement(ChangableAmountProvider, null, /*#__PURE__*/React.createElement(PaymentTrackingProvider, {
                  document: ensureDocument(document)
                }, /*#__PURE__*/React.createElement(SaleRoutingProvider, {
                  container: container,
                  document: document
                }, /*#__PURE__*/React.createElement(SaleStack, {
                  document: document,
                  container: container
                }), /*#__PURE__*/React.createElement(PoweredBy, null)))))))))));
              };
            });
            return _context2.abrupt("return", {
              unmount: unmount
            });

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](2);
            console.log('critical error', _context2.t0);

            if (critical != undefined) {
              critical(_context2.t0);
            }

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[2, 12]]);
  }));

  return function Sale(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var msToTime = (function (ms) {
  var year, month, day, hour, minute, second;
  second = Math.floor(ms / 1000);
  minute = Math.floor(second / 60);
  second = second % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  month = Math.floor(day / 30);
  day = day % 30;
  year = Math.floor(month / 12);
  month = month % 12;
  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second
  };
});

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var ConfirmNFTSelectionDialog = (function (props) {
  var _selection$nft, _selection$blockchain;

  var _useContext = useContext(SelectionContext),
      selection = _useContext.selection;
      _useContext.setSelection;

  var _useContext2 = useContext(ClosableContext),
      setOpen = _useContext2.setOpen;

  var _useContext3 = useContext(NavigateStackContext),
      navigate = _useContext3.navigate;

  var age;

  if (selection.nft.createdAt) {
    age = msToTime(new Date() - new Date(selection.nft.createdAt));
    age = [age.year && age.year >= 1 ? age.year >= 2 ? "".concat(age.year, " years") : "1 year" : undefined, age.month && age.month >= 1 ? age.month >= 2 ? "".concat(age.month, " months") : "1 month" : undefined, age.day && age.day >= 1 && age.month <= 1 && age.year < 1 ? age.day >= 2 ? "".concat(age.day, " days !!!") : "1 day !!!" : undefined].filter(function (n) {
      return n;
    }).join(' ');
  }

  var blockchain = ((_selection$nft = selection.nft) === null || _selection$nft === void 0 ? void 0 : _selection$nft.blockchain) || ((_selection$blockchain = selection.blockchain) === null || _selection$blockchain === void 0 ? void 0 : _selection$blockchain.name);

  if (blockchain == undefined) {
    navigate('SelectBlockchain');
    return null;
  }

  var onClickConfirm = function onClickConfirm() {
    setOpen(false);
    props.resolve(_objectSpread(_objectSpread({}, selection.nft), {}, {
      blockchain: blockchain
    }));
    setTimeout(props.unmount, 300);
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Confirm Selection"))),
    stacked: true,
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TokenImage medium TextCenter"
    }, selection.nft.image && /*#__PURE__*/React.createElement("img", {
      src: selection.nft.image
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Alert FontSizeS"
    }, /*#__PURE__*/React.createElement("strong", null, "Review this information"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("table", {
      className: "Table TextLeft FontSizeS"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Blockchain")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, Blockchains.findByName(blockchain).label))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Name")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      className: "Link",
      href: selection.nft.link,
      target: "_blank",
      rel: "noopener noreferrer"
    }, selection.nft.name))), selection.nft.address && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Address")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
      className: "Link",
      title: selection.nft.address,
      href: Blockchains.findByName(blockchain).explorerUrlFor({
        token: selection.nft.address
      }),
      target: "_blank",
      rel: "noopener noreferrer"
    }, addressEllipsis(selection.nft.address, 6))))), selection.nft.id && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Token ID")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, selection.nft.id))), selection.nft.addresses && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Addresses")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, selection.nft.addresses.join(", ")))))))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: onClickConfirm
    }, "Confirm"))
  });
});

var EnterNFTDataManuallyDialog = (function (props) {
  var _Blockchains, _selection$blockchain3, _selection$collection3, _Blockchains2, _selection$blockchain4, _selection$collection4, _Blockchains$findByNa, _selection$blockchain5, _selection$collection5, _selection$blockchain6, _selection$blockchain7, _selection$blockchain8, _selection$blockchain9, _selection$blockchain10;

  var _useContext = useContext(NavigateStackContext),
      navigate = _useContext.navigate;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2);
      _useState2[0];
      var setBlockchain = _useState2[1];

  var _useContext2 = useContext(SelectionContext),
      selection = _useContext2.selection,
      setSelection = _useContext2.setSelection;

  var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      addresses = _useState4[0],
      setAddresses = _useState4[1];

  var _useState5 = useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      address = _useState6[0],
      setAddress = _useState6[1];

  var _useState7 = useState(''),
      _useState8 = _slicedToArray(_useState7, 2),
      id = _useState8[0],
      setId = _useState8[1];

  var _useState9 = useState(''),
      _useState10 = _slicedToArray(_useState9, 2),
      image = _useState10[0],
      setImage = _useState10[1];

  var _useState11 = useState(''),
      _useState12 = _slicedToArray(_useState11, 2),
      link = _useState12[0],
      setLink = _useState12[1];

  var _useState13 = useState(''),
      _useState14 = _slicedToArray(_useState13, 2),
      name = _useState14[0],
      setName = _useState14[1];

  var _useState15 = useState(false),
      _useState16 = _slicedToArray(_useState15, 2),
      idRequired = _useState16[0],
      setIdRequired = _useState16[1];

  var confirm = function confirm() {
    var _selection$blockchain, _selection$collection;

    var blockchain = (selection === null || selection === void 0 ? void 0 : (_selection$blockchain = selection.blockchain) === null || _selection$blockchain === void 0 ? void 0 : _selection$blockchain.name) || (selection === null || selection === void 0 ? void 0 : selection.blockchain) || (selection === null || selection === void 0 ? void 0 : (_selection$collection = selection.collection) === null || _selection$collection === void 0 ? void 0 : _selection$collection.blockchain);
    setSelection(Object.assign(props.selection, {
      nft: {
        blockchain: blockchain,
        address: address.length ? address : undefined,
        addresses: addresses.length ? addresses.split("\n").map(function (address) {
          return address.replace(/\s*/, '');
        }) : undefined,
        id: id.length ? id : undefined,
        image: image,
        name: name,
        link: link,
        type: supported.svm.includes(blockchain) ? 'metaplex' : idRequired ? '1155' : '721'
      }
    }));
    navigate('ConfirmNFTSelection');
  };

  var startWithBlockchain = function startWithBlockchain(name) {
    var blockchain = Blockchains.findByName(name);
    setBlockchain(blockchain);
    setSelection(Object.assign(props.selection, {
      blockchain: blockchain,
      token: undefined
    }));
  };

  useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var blockchain;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setTimeout(function () {
                if (blockchain) {
                  return;
                }

                if (window._depay_token_selection_selected_blockchain) {
                  startWithBlockchain(window._depay_token_selection_selected_blockchain);
                } else {
                  startWithBlockchain('ethereum');
                }
              }, 400);
              getWallets({
                drip: function drip(wallet) {
                  if (wallet && !blockchain) {
                    new wallet().connectedTo().then(function (name) {
                      blockchain = Blockchains.findByName(name);

                      if (window._depay_token_selection_selected_blockchain) {
                        startWithBlockchain(window._depay_token_selection_selected_blockchain);
                      } else if (name && name.length && blockchain && blockchain.tokens && blockchain.tokens.length) {
                        startWithBlockchain(name);
                      } else {
                        startWithBlockchain('ethereum');
                      }
                    })["catch"](function () {
                      return startWithBlockchain('ethereum');
                    });
                  } else {
                    startWithBlockchain('ethereum');
                  }
                }
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, []);
  useEffect(function () {
    setAddress('');
    setAddresses('');
    setId('');
    setImage('');
    setLink('');
    setName('');
    setIdRequired(false);
    setBlockchain(selection.blockchain);
  }, [selection.blockchain]);
  useEffect(function () {
    var _selection$blockchain2, _selection$collection2;

    var blockchain = (selection === null || selection === void 0 ? void 0 : (_selection$blockchain2 = selection.blockchain) === null || _selection$blockchain2 === void 0 ? void 0 : _selection$blockchain2.name) || (selection === null || selection === void 0 ? void 0 : selection.blockchain) || (selection === null || selection === void 0 ? void 0 : (_selection$collection2 = selection.collection) === null || _selection$collection2 === void 0 ? void 0 : _selection$collection2.blockchain);

    var checkForIdRequired = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
        var balanceWithId;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(blockchain && !supported.svm.includes(blockchain))) {
                  _context2.next = 10;
                  break;
                }

                _context2.prev = 1;
                _context2.next = 4;
                return request({
                  blockchain: blockchain,
                  address: address,
                  method: 'balanceOf',
                  api: Token[blockchain][1155],
                  params: [address, '1']
                });

              case 4:
                balanceWithId = _context2.sent;
                _context2.next = 9;
                break;

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](1);

              case 9:
                setIdRequired(!!balanceWithId);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 7]]);
      }));

      return function checkForIdRequired() {
        return _ref2.apply(this, arguments);
      };
    }();

    checkForIdRequired();
  }, [address]);
  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Enter NFT data")), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Card small",
      onClick: function onClick() {
        return navigate('SelectBlockchain');
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage small"
    }, /*#__PURE__*/React.createElement("img", {
      className: "transparent BlockchainLogo small",
      src: (_Blockchains = Blockchains[(selection === null || selection === void 0 ? void 0 : (_selection$blockchain3 = selection.blockchain) === null || _selection$blockchain3 === void 0 ? void 0 : _selection$blockchain3.name) || (selection === null || selection === void 0 ? void 0 : selection.blockchain) || (selection === null || selection === void 0 ? void 0 : (_selection$collection3 = selection.collection) === null || _selection$collection3 === void 0 ? void 0 : _selection$collection3.blockchain)]) === null || _Blockchains === void 0 ? void 0 : _Blockchains.logo,
      style: {
        backgroundColor: (_Blockchains2 = Blockchains[(selection === null || selection === void 0 ? void 0 : (_selection$blockchain4 = selection.blockchain) === null || _selection$blockchain4 === void 0 ? void 0 : _selection$blockchain4.name) || (selection === null || selection === void 0 ? void 0 : selection.blockchain) || (selection === null || selection === void 0 ? void 0 : (_selection$collection4 = selection.collection) === null || _selection$collection4 === void 0 ? void 0 : _selection$collection4.blockchain)]) === null || _Blockchains2 === void 0 ? void 0 : _Blockchains2.logoBackgroundColor
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "CardBody FontSizeM"
    }, (_Blockchains$findByNa = Blockchains.findByName((selection === null || selection === void 0 ? void 0 : (_selection$blockchain5 = selection.blockchain) === null || _selection$blockchain5 === void 0 ? void 0 : _selection$blockchain5.name) || (selection === null || selection === void 0 ? void 0 : selection.blockchain) || (selection === null || selection === void 0 ? void 0 : (_selection$collection5 = selection.collection) === null || _selection$collection5 === void 0 ? void 0 : _selection$collection5.blockchain))) === null || _Blockchains$findByNa === void 0 ? void 0 : _Blockchains$findByNa.label), /*#__PURE__*/React.createElement("div", {
      className: "CardAction"
    }, /*#__PURE__*/React.createElement(ChevronRightIcon, null))))),
    bodyClassName: "ScrollHeight",
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", null, supported.svm.includes(selection === null || selection === void 0 ? void 0 : (_selection$blockchain6 = selection.blockchain) === null || _selection$blockchain6 === void 0 ? void 0 : _selection$blockchain6.name) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS TextLeft"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "DePayWidgetsEnterNFTTokenAddresses"
    }, /*#__PURE__*/React.createElement("div", {
      className: "FontSizeS Opacity05"
    }, "Token Mint Addresses"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS TextLeft"
    }, /*#__PURE__*/React.createElement("textarea", {
      id: "DePayWidgetsEnterNFTTokenAddresses",
      name: "DePayWidgetsEnterNFTTokenAddress",
      value: addresses,
      onChange: function onChange(event) {
        return setAddresses(event.target.value);
      },
      placeholder: "4LWoVdJWNFQCvDZsf2EP6xD8xAF6S7RhQKkA5gjxJEnn\n979vHrvJ5d4CoCv2Hx5PHN837dsJe9ijhNAQwmY7hpcx",
      className: "InputField small",
      rows: 4,
      style: {
        resize: "vertical",
        minHeight: "78px",
        width: "100%"
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "FontSizeXS PaddingLeftXS PaddingRightXS Opacity03 LineHeightXS"
    }, "Separate each one with a new line break."))), !supported.svm.includes(selection === null || selection === void 0 ? void 0 : (_selection$blockchain7 = selection.blockchain) === null || _selection$blockchain7 === void 0 ? void 0 : _selection$blockchain7.name) && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS TextLeft"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "DePayWidgetsEnterNFTTokenAddress"
    }, /*#__PURE__*/React.createElement("div", {
      className: "FontSizeS Opacity05"
    }, "Token Contract Address"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS TextLeft"
    }, /*#__PURE__*/React.createElement("input", {
      id: "DePayWidgetsEnterNFTTokenAddress",
      name: "DePayWidgetsEnterNFTTokenAddress",
      value: address,
      onChange: function onChange(event) {
        return setAddress(event.target.value);
      },
      placeholder: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      className: "InputField small",
      style: {
        width: "100%"
      }
    })))), idRequired && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS TextLeft"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "DePayWidgetsEnterNFTTokenId"
    }, /*#__PURE__*/React.createElement("span", {
      className: "FontSizeS Opacity05"
    }, "Token ID"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS TextLeft"
    }, /*#__PURE__*/React.createElement("input", {
      id: "DePayWidgetsEnterNFTTokenId",
      name: "DePayWidgetsEnterNFTTokenId",
      value: id,
      onChange: function onChange(event) {
        return setId(event.target.value);
      },
      placeholder: "35347623114821255323888368639026081793120226253597860997754787919489216283624",
      className: "InputField small"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS TextLeft"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "DePayWidgetsEnterNFTName"
    }, /*#__PURE__*/React.createElement("span", {
      className: "FontSizeS Opacity05"
    }, "NFT Name"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS TextLeft"
    }, /*#__PURE__*/React.createElement("input", {
      id: "DePayWidgetsEnterNFTName",
      name: "DePayWidgetsEnterNFTName",
      value: name,
      onChange: function onChange(event) {
        return setName(event.target.value);
      },
      placeholder: supported.svm.includes(selection === null || selection === void 0 ? void 0 : (_selection$blockchain8 = selection.blockchain) === null || _selection$blockchain8 === void 0 ? void 0 : _selection$blockchain8.name) ? 'SMB' : 'CryptoPunks',
      className: "InputField small"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS TextLeft"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "DePayWidgetsEnterNFTImage"
    }, /*#__PURE__*/React.createElement("span", {
      className: "FontSizeS Opacity05"
    }, "Image URL"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS TextLeft"
    }, /*#__PURE__*/React.createElement("input", {
      id: "DePayWidgetsEnterNFTImage",
      name: "DePayWidgetsEnterNFTImage",
      value: image,
      onChange: function onChange(event) {
        return setImage(event.target.value);
      },
      placeholder: supported.svm.includes(selection === null || selection === void 0 ? void 0 : (_selection$blockchain9 = selection.blockchain) === null || _selection$blockchain9 === void 0 ? void 0 : _selection$blockchain9.name) ? 'https://img-cdn.magiceden.dev/rs:fill:128:128:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/smb_gen3_pfp_1688353503184.png' : 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=128',
      className: "InputField small"
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS TextLeft"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "DePayWidgetsEnterNFTLink"
    }, /*#__PURE__*/React.createElement("span", {
      className: "FontSizeS Opacity05"
    }, "Link URL"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomS TextLeft"
    }, /*#__PURE__*/React.createElement("input", {
      id: "DePayWidgetsEnterNFTLink",
      name: "DePayWidgetsEnterNFTLink",
      value: link,
      onChange: function onChange(event) {
        return setLink(event.target.value);
      },
      placeholder: supported.svm.includes(selection === null || selection === void 0 ? void 0 : (_selection$blockchain10 = selection.blockchain) === null || _selection$blockchain10 === void 0 ? void 0 : _selection$blockchain10.name) ? "https://magiceden.io/marketplace/smb_gen3" : "https://opensea.io/collection/cryptopunks",
      className: "InputField small"
    })))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomM"
    }, /*#__PURE__*/React.createElement("button", {
      className: ['ButtonPrimary', !image.length || !address.length && !addresses.length || !link.length || !name.length || idRequired && !id.length ? 'disabled' : ''].join(' '),
      onClick: function onClick() {
        if (!image.length || !address.length && !addresses.length || !link.length || !name.length || idRequired && !id.length) {
          return;
        }

        confirm();
      }
    }, "Continue"))
  });
});

var SelectBlockchainDialog = (function (props) {
  var _useContext = useContext(SelectionContext),
      setSelection = _useContext.setSelection;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      searchTerm = _useState2[0],
      setSearchTerm = _useState2[1];

  var _useContext2 = useContext(NavigateStackContext),
      navigate = _useContext2.navigate;

  var stacked = props.stacked || Object.keys(props.selection).length > 1;
  var allBlockchains = supported.map(function (blockchainName) {
    return Blockchains[blockchainName];
  });

  var _useState3 = useState(allBlockchains),
      _useState4 = _slicedToArray(_useState3, 2),
      blockchains = _useState4[0],
      setBlockchains = _useState4[1];

  var searchElement = useRef();
  var listElement = useRef();
  var fuse = new Fuse(allBlockchains, {
    keys: ['label', 'name'],
    threshold: 0.3,
    ignoreFieldNorm: true
  });

  var selectBlockchain = function selectBlockchain(blockchain) {
    window._depay_token_selection_selected_blockchain = blockchain.name;
    setSelection(Object.assign(props.selection, {
      blockchain: blockchain
    }));

    if (stacked && props.navigateBack !== false) {
      navigate('back');
    } else {
      props.resolve(blockchain);
    }
  };

  var onChangeSearch = function onChangeSearch(event) {
    setSearchTerm(event.target.value);

    if (event.target.value.length > 1) {
      setBlockchains(fuse.search(event.target.value).map(function (result) {
        return result.item;
      }));
    } else {
      setBlockchains(allBlockchains);
    }
  };

  useEffect(function () {
    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'Enter' && blockchains.length == 1) {
        selectBlockchain(blockchains[0]);
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [blockchains]);
  useEffect(function () {
    var focusNextElement = function focusNextElement(event) {
      var focusable = Array.from(listElement.current.querySelectorAll('button.Card'));
      var index = focusable.indexOf(listElement.current.querySelector(':focus'));

      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else if (index < focusable.length - 1) {
        focusable[0].focus();
        event.preventDefault();
        return false;
      }
    };

    var focusPrevElement = function focusPrevElement(event) {
      var focusable = Array.from(listElement.current.querySelectorAll('button.Card'));
      var index = focusable.indexOf(listElement.current.querySelector(':focus'));

      if (index == 0) {
        searchElement.current.focus();
      } else if (index > 0 && index <= focusable.length - 1) {
        focusable[index - 1].focus();
      }
    };

    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'ArrowUp') {
        focusPrevElement();
      } else if (event.key === 'ArrowDown') {
        focusNextElement(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Select Blockchain"), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS TextLeft"
    }, /*#__PURE__*/React.createElement("input", {
      value: searchTerm,
      autoFocus: !isMobile(),
      onChange: onChangeSearch,
      className: "Search",
      placeholder: "Search by name",
      ref: searchElement
    })))),
    stacked: stacked,
    bodyClassName: "ScrollHeight",
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS PaddingRightS PaddingBottomS",
      ref: listElement
    }, blockchains.map(function (blockchain, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: "MarginBottomXS"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "Card small",
        onClick: function onClick() {
          return selectBlockchain(blockchain);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardImage small"
      }, /*#__PURE__*/React.createElement("img", {
        className: "transparent BlockchainLogo",
        src: blockchain.logo,
        style: {
          backgroundColor: blockchain.logoBackgroundColor
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React.createElement("span", {
        className: "CardText FontSizeM"
      }, blockchain.label))));
    })),
    footer: false
  });
});

var SelectNFTStack = (function (props) {
  var _useContext = useContext(ConfigurationContext);
      _useContext.what;

  var _useContext2 = useContext(ClosableContext),
      open = _useContext2.open,
      close = _useContext2.close;

  var _useContext3 = useContext(SelectionContext),
      selection = _useContext3.selection;
      _useContext3.setSelection;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2);
      _useState2[0];
      var _setNavigator = _useState2[1];

  return /*#__PURE__*/React.createElement(ReactDialogStack, {
    open: open,
    close: close,
    start: 'EnterDataManually',
    container: props.container,
    document: props.document,
    setNavigator: function setNavigator(navigator) {
      _setNavigator(navigator);
    },
    dialogs: {
      // SearchNFT: <SearchNFTDialog navigator={navigator} selection={selection} resolve={props.resolve} unmount={props.unmount} />,
      EnterDataManually: /*#__PURE__*/React.createElement(EnterNFTDataManuallyDialog, {
        selection: selection,
        resolve: props.resolve,
        unmount: props.unmount
      }),
      SelectBlockchain: /*#__PURE__*/React.createElement(SelectBlockchainDialog, {
        stacked: true,
        selection: selection,
        resolve: props.resolve,
        unmount: props.unmount
      }),
      ConfirmNFTSelection: /*#__PURE__*/React.createElement(ConfirmNFTSelectionDialog, {
        selection: selection,
        resolve: props.resolve,
        unmount: props.unmount
      })
    }
  });
});

var ConfirmTokenSelectionDialog = (function (props) {
  var _useContext = useContext(SelectionContext),
      selection = _useContext.selection;

  var _useContext2 = useContext(ClosableContext),
      setOpen = _useContext2.setOpen;

  var token = selection.token;
  var address = token.address || token.external_id;
  var logo = token.logo || token.image;
  var blockchain = Blockchains.findByName(token.blockchain);
  var age = token.first_transfer ? msToTime(new Date() - new Date(token.first_transfer)) : undefined;

  if (age) {
    age = [age.year && age.year >= 1 ? age.year >= 2 ? "".concat(age.year, " years") : "1 year" : undefined, age.month && age.month >= 1 ? age.month >= 2 ? "".concat(age.month, " months") : "1 month" : undefined, age.day && age.day >= 1 && age.month <= 1 && age.year < 1 ? age.day >= 2 ? "".concat(age.day, " days !!!") : "1 day !!!" : undefined].filter(function (n) {
      return n;
    }).join(' ');
  }

  var holders = token.unique_senders ? token.unique_senders : undefined;

  if (holders) {
    if (holders > 1000000) {
      holders = "Millions";
    } else if (holders > 100000) {
      holders = "Hundreds of Thousands";
    } else if (holders > 2000) {
      holders = "Thousands";
    } else if (holders > 100) {
      holders = "Hundreds";
    } else {
      holders = "Only a Few!!!";
    }
  }

  var onClickConfirm = function onClickConfirm() {
    setOpen(false);
    props.resolve({
      blockchain: token.blockchain,
      address: token.external_id || token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logo: token.image || token.logo,
      routable: token.routable
    });
    setTimeout(props.unmount, 300);
  };

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Confirm Selection"))),
    stacked: true,
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM"
    }, /*#__PURE__*/React.createElement("div", {
      className: "TokenImage medium TextCenter"
    }, logo && /*#__PURE__*/React.createElement("img", {
      src: logo
    }), !logo && /*#__PURE__*/React.createElement(TokenImage, {
      blockchain: token.blockchain,
      address: address
    })), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS TextCenter"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Alert FontSizeS"
    }, /*#__PURE__*/React.createElement("strong", null, "Review this information"))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS"
    }, /*#__PURE__*/React.createElement("table", {
      className: "Table TextLeft FontSizeS"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Address")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
      className: "Link",
      title: address,
      href: blockchain.explorerUrlFor({
        token: address
      }),
      target: "_blank",
      rel: "noopener noreferrer"
    }, addressEllipsis(address, 8))))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Blockchain")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, blockchain.label))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Symbol")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, token.symbol))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Name")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, token.name))), age && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Age")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, age))), holders && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "TableSubTitle"
    }, "Holders")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, holders))))))),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("button", {
      className: "ButtonPrimary",
      onClick: onClickConfirm
    }, "Confirm"))
  });
});

var SelectTokenDialog = (function (props) {
  var _useContext = useContext(NavigateStackContext),
      navigate = _useContext.navigate;

  var _useContext2 = useContext(ClosableContext),
      setOpen = _useContext2.setOpen;

  var _useContext3 = useContext(SelectionContext),
      setSelection = _useContext3.setSelection;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      searchTerm = _useState4[0],
      setSearchTerm = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      blockchain = _useState6[0],
      setBlockchain = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      showAddToken = _useState8[0],
      setShowAddToken = _useState8[1];

  var _useState9 = useState([]),
      _useState10 = _slicedToArray(_useState9, 2),
      tokens = _useState10[0],
      setTokens = _useState10[1];

  var _useState11 = useState(),
      _useState12 = _slicedToArray(_useState11, 2);
      _useState12[0];
      _useState12[1];

  var searchElement = useRef();
  var listElement = useRef();

  var startWithBlockchain = function startWithBlockchain(name) {
    var blockchain = Blockchains.findByName(name);
    setBlockchain(blockchain);
    setSelection(Object.assign(props.selection, {
      blockchain: blockchain,
      token: undefined
    }));
    setTokens(blockchain.tokens);
  };

  useEffect(function () {
    var focusNextElement = function focusNextElement(event) {
      var focusable = Array.from(listElement.current.querySelectorAll('button.Card'));
      var index = focusable.indexOf(listElement.current.querySelector(':focus'));

      if (index > -1 && index < focusable.length - 1) {
        focusable[index + 1].focus();
      } else if (index < focusable.length - 1) {
        focusable[0].focus();
        event.preventDefault();
        return false;
      }
    };

    var focusPrevElement = function focusPrevElement(event) {
      var focusable = Array.from(listElement.current.querySelectorAll('button.Card'));
      var index = focusable.indexOf(listElement.current.querySelector(':focus'));

      if (index == 0) {
        searchElement.current.focus();
      } else if (index > 0 && index <= focusable.length - 1) {
        focusable[index - 1].focus();
      }
    };

    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'ArrowUp') {
        focusPrevElement();
      } else if (event.key === 'ArrowDown') {
        focusNextElement(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(function () {
    var handleKeyDown = function handleKeyDown(event) {
      if (event.key === 'Enter' && tokens.length == 1) {
        select(tokens[0]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return function () {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tokens]);
  useEffect(function () {
    _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      var blockchain;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setTimeout(function () {
                if (blockchain) {
                  return;
                }

                if (window._depay_token_selection_selected_blockchain) {
                  startWithBlockchain(window._depay_token_selection_selected_blockchain);
                } else {
                  startWithBlockchain('ethereum');
                }
              }, 400);
              getWallets({
                drip: function drip(wallet) {
                  if (wallet && !blockchain) {
                    new wallet().connectedTo().then(function (name) {
                      blockchain = Blockchains.findByName(name);

                      if (window._depay_token_selection_selected_blockchain) {
                        startWithBlockchain(window._depay_token_selection_selected_blockchain);
                      } else if (name && name.length && blockchain && blockchain.tokens && blockchain.tokens.length) {
                        startWithBlockchain(name);
                      } else {
                        startWithBlockchain('ethereum');
                      }
                    })["catch"](function () {
                      return startWithBlockchain('ethereum');
                    });
                  } else {
                    startWithBlockchain('ethereum');
                  }
                }
              });

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, []);
  useEffect(function () {
    if (props.selection.blockchain) {
      setBlockchain(props.selection.blockchain);
      setTokens(props.selection.blockchain.tokens);

      if (searchElement.current) {
        searchElement.current.value = '';

        if (!isMobile()) {
          searchElement.current.focus();
        }
      }
    }
  }, [props.selection, props.selection.blockchain]);

  var onClickChangeBlockchain = function onClickChangeBlockchain() {
    navigate('SelectBlockchain');
  };

  var onClickAddToken = function onClickAddToken() {
    setShowAddToken(true);

    if (searchElement.current) {
      searchElement.current.value = '';
    }
  };

  var searchTokens = useCallback(debounce(function (term, blockchainName) {
    fetch("https://public.depay.com/tokens/search?blockchain=".concat(blockchainName, "&term=").concat(term)).then(function (response) {
      if (response.status == 200) {
        response.json().then(function (tokens) {
          setTokens(tokens);
          setLoading(false);
        })["catch"](function () {
          return reject;
        });
      } else {
        reject();
      }
    })["catch"](function () {
      return reject;
    });
  }, 500), []);

  var onChangeSearch = function onChangeSearch(event) {
    setShowAddToken(false);
    setLoading(true);
    var term = event.target.value;
    setSearchTerm(term);

    if (term.match(/^0x/)) {
      setTokens([]);
      var token;

      try {
        token = new Token({
          blockchain: blockchain.name,
          address: term
        });
      } catch (_unused) {}

      if (token == undefined) {
        setLoading(false);
        return;
      }

      Promise.all([token.name(), token.symbol(), token.decimals(), fetch("https://public.depay.com/tokens/routable/".concat(blockchain.name, "/").concat(term)).then(function (response) {
        if (response.status == 200) {
          return response.json();
        }
      })]).then(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 4),
            name = _ref3[0],
            symbol = _ref3[1],
            decimals = _ref3[2],
            routable = _ref3[3];

        setTokens([{
          name: name,
          symbol: symbol,
          decimals: decimals,
          address: term,
          blockchain: blockchain.name,
          routable: !!routable
        }]);
        setLoading(false);
      });
    } else if (term.length > 32 && term.length <= 44 && !/[^123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]/.test(term)) {
      setTokens([]);

      var _token;

      try {
        _token = new Token({
          blockchain: blockchain.name,
          address: term
        });
      } catch (_unused2) {}

      if (_token == undefined) {
        setLoading(false);
        return;
      }

      Promise.all([_token.name(), _token.symbol(), _token.decimals(), fetch("https://public.depay.com/tokens/routable/".concat(blockchain.name, "/").concat(term)).then(function (response) {
        if (response.status == 200) {
          return response.json();
        }
      })]).then(function (_ref4) {
        var _ref5 = _slicedToArray(_ref4, 4),
            name = _ref5[0],
            symbol = _ref5[1],
            decimals = _ref5[2],
            routable = _ref5[3];

        setTokens([{
          name: name,
          symbol: symbol,
          decimals: decimals,
          address: term,
          blockchain: blockchain.name,
          routable: !!routable
        }]);
        setLoading(false);
      });
    } else if (term && term.length) {
      setTokens([]);
      searchTokens(term, blockchain.name);
    } else {
      setTokens(blockchain.tokens);
      setLoading(false);
    }
  };

  var select = function select(token) {
    if (token.address) {
      if (token.address.match('0x')) {
        token.address = ethers.utils.getAddress(token.address);
      }
    }

    if (token.external_id) {
      if (token.external_id.match('0x')) {
        token.external_id = ethers.utils.getAddress(token.external_id);
      }
    }

    if (blockchain.tokens.find(function (majorToken) {
      return majorToken.address == (token.address || token.external_id);
    })) {
      setOpen(false);
      props.resolve({
        blockchain: blockchain.name,
        address: token.address || token.external_id,
        logo: token.logo || token.image,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        routable: true
      });
      setTimeout(props.unmount, 300);
    } else {
      setSelection(Object.assign(props.selection, {
        token: token
      }));
      navigate('ConfirmTokenSelection');
    }
  };

  var elements;

  if (loading) {
    elements = [/*#__PURE__*/React.createElement("div", {
      className: "SkeletonWrapper",
      key: 'loading'
    }, /*#__PURE__*/React.createElement("div", {
      className: "Skeleton Card MarginBottomXS PaddingTopXS PaddingBottomXS",
      style: {
        height: '69px',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "SkeletonBackground"
    })))];
  } else {
    elements = tokens.map(function (token, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: "".concat(index, "-").concat(token.address),
        className: "MarginBottomXS"
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "Card small PaddingTopXS PaddingBottomXS",
        onClick: function onClick() {
          return select(token);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardImage"
      }, token.logo && /*#__PURE__*/React.createElement("img", {
        src: token.logo
      }), token.image && /*#__PURE__*/React.createElement("img", {
        src: token.image
      }), !(token.logo || token.image) && /*#__PURE__*/React.createElement(TokenImage, {
        blockchain: token.blockchain,
        address: token.external_id || token.address
      })), /*#__PURE__*/React.createElement("div", {
        className: "CardBody"
      }, /*#__PURE__*/React.createElement("div", {
        className: "CardTokenSymbol",
        title: token.symbol
      }, /*#__PURE__*/React.createElement("span", {
        className: "CardText"
      }, token.symbol)), /*#__PURE__*/React.createElement("div", {
        className: "CardTokenName",
        title: token.name
      }, /*#__PURE__*/React.createElement("span", {
        className: "CardText FontSizeM"
      }, token.name)))));
    });
  }

  if (!blockchain) {
    return /*#__PURE__*/React.createElement(Dialog$1, {
      header: /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
        className: "LineHeightL FontSizeL"
      }, "Select Token")), /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopS PaddingBottomXS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonWrapper",
        key: 'loading'
      }, /*#__PURE__*/React.createElement("div", {
        className: "Skeleton",
        style: {
          height: '46px',
          borderRadius: '8px',
          width: '100%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonBackground"
      })))), /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS PaddingBottomS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonWrapper",
        key: 'loading'
      }, /*#__PURE__*/React.createElement("div", {
        className: "Skeleton",
        style: {
          height: '50px',
          borderRadius: '8px',
          width: '100%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "SkeletonBackground"
      }))))),
      bodyClassName: "ScrollHeight",
      body: /*#__PURE__*/React.createElement("div", {
        className: ""
      }, [1, 2, 3, 4, 5, 6].map(function (index) {
        return /*#__PURE__*/React.createElement("div", {
          className: "SkeletonWrapper",
          key: index,
          style: {
            marginBottom: '1px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "Skeleton Card MarginBottomXS PaddingTopXS PaddingBottomXS",
          style: {
            height: '69px',
            width: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "SkeletonBackground"
        })));
      })),
      footer: /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
      }, /*#__PURE__*/React.createElement("div", {
        className: "PaddingTopXS PaddingBottomXS",
        style: {
          height: "32px"
        }
      }))
    });
  }

  return /*#__PURE__*/React.createElement(Dialog$1, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingLeftM PaddingRightM TextLeft"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "LineHeightL FontSizeL"
    }, "Select Token")), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Card small",
      onClick: onClickChangeBlockchain
    }, /*#__PURE__*/React.createElement("div", {
      className: "CardImage small"
    }, /*#__PURE__*/React.createElement("img", {
      className: "transparent BlockchainLogo",
      src: blockchain.logo,
      style: {
        backgroundColor: blockchain.logoBackgroundColor
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "CardBody FontSizeM"
    }, blockchain.label), /*#__PURE__*/React.createElement("div", {
      className: "CardAction"
    }, /*#__PURE__*/React.createElement(ChevronRightIcon, null)))), /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("input", {
      value: searchTerm,
      autoFocus: !isMobile(),
      onBlur: function onBlur() {
        return setShowAddToken(false);
      },
      onChange: onChangeSearch,
      className: "Search",
      placeholder: "Search name or paste address",
      ref: searchElement
    }), showAddToken && /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingRightXS PaddingLeftXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Tooltip"
    }, /*#__PURE__*/React.createElement("span", {
      className: "TooltipArrowUp"
    }), "Enter token address here"))))),
    bodyClassName: "ScrollHeight",
    body: /*#__PURE__*/React.createElement("div", {
      className: "PaddingLeftS PaddingRightS",
      ref: listElement
    }, elements),
    footer: /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopS PaddingRightM PaddingLeftM PaddingBottomS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "PaddingTopXS PaddingBottomXS"
    }, /*#__PURE__*/React.createElement("div", {
      className: "Link FontSizeS",
      onClick: onClickAddToken
    }, "Token missing? Add it.")))
  });
});

var SelectTokenStack = (function (props) {
  var _useContext = useContext(ConfigurationContext),
      what = _useContext.what;

  var _useContext2 = useContext(ClosableContext),
      open = _useContext2.open,
      close = _useContext2.close;

  var _useContext3 = useContext(SelectionContext),
      selection = _useContext3.selection;

  var start;

  switch (what) {
    default:
      start = 'SelectToken';
  }

  return /*#__PURE__*/React.createElement(ReactDialogStack, {
    open: open,
    close: close,
    start: start,
    container: props.container,
    document: props.document,
    dialogs: {
      SelectToken: /*#__PURE__*/React.createElement(SelectTokenDialog, {
        selection: selection,
        resolve: props.resolve,
        unmount: props.unmount
      }),
      SelectBlockchain: /*#__PURE__*/React.createElement(SelectBlockchainDialog, {
        selection: selection,
        resolve: props.resolve,
        unmount: props.unmount
      }),
      ConfirmTokenSelection: /*#__PURE__*/React.createElement(ConfirmTokenSelectionDialog, {
        selection: selection,
        resolve: props.resolve,
        unmount: props.unmount
      })
    }
  });
});

var Select = function Select(options) {
  requireReactVersion();
  var style, error, document, what;

  if (_typeof(options) == 'object') {
    style = options.style;
    error = options.error;
    document = options.document;
    what = options.what;
  }

  var startupError;

  if (what == undefined) {
    startupError = '"what" needs to be configured!';
  } else if (['token', 'nft'].indexOf(what) < 0) {
    startupError = "Unknown \"what\" configured: ".concat(what, "!");
  }

  return new Promise( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(resolve, reject) {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              mount({
                style: style,
                document: ensureDocument(document)
              }, function (unmount) {
                var userClosedDialog = function userClosedDialog() {
                  reject('USER_CLOSED_DIALOG');
                  unmount();
                };

                return function (container) {
                  return /*#__PURE__*/React.createElement(ErrorProvider, {
                    error: startupError,
                    errorCallback: error,
                    container: container,
                    unmount: unmount
                  }, /*#__PURE__*/React.createElement(ConfigurationProvider, {
                    configuration: {
                      what: what
                    }
                  }, /*#__PURE__*/React.createElement(UpdatableProvider, null, /*#__PURE__*/React.createElement(ClosableProvider, {
                    unmount: userClosedDialog
                  }, /*#__PURE__*/React.createElement(SelectionProvider, null, what == 'token' && /*#__PURE__*/React.createElement(SelectTokenStack, {
                    document: document,
                    container: container,
                    unmount: unmount,
                    resolve: resolve
                  }), what == 'nft' && /*#__PURE__*/React.createElement(SelectNFTStack, {
                    document: document,
                    container: container,
                    unmount: unmount,
                    resolve: resolve
                  })), /*#__PURE__*/React.createElement(PoweredBy, null)))));
                };
              });

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var DePayWidgets = {
  Connect: Connect,
  Login: Login,
  Payment: Payment,
  Sale: Sale,
  Select: Select,
  Loading: Loading,
  allWallets: allWallets
};

export { DePayWidgets as default };
//# sourceMappingURL=index.js.map
