declare namespace DePayWidgets {

  interface ColorsOptions {
    primary?: string;
    text?: string;
    buttonText?: string;
    icons?: string;
  }

  interface StyleOptions {
    colors?: ColorsOptions;
    fontFamily?: string;
    css?: string;
  }

  interface AcceptOptions {
    blockchain: string;
    token: string;
    receiver: string;
    amount?: number;
    fee?: {
      amount: string;
      receiver: string;
    };
  }

  interface BlockchainStringListOptions {
    ethereum?: string[];
    bsc?: string[];
    polygon?: string[];
    solana?: string[];
  }

  interface BlockchainStringOptions {
    ethereum?: string;
    bsc?: string;
    polygon?: string;
    solana?: string;
  }

  interface PaymentOptions {
    accept: AcceptOptions[];
    amount?: {
      currency?: string;
      fix?: number;
    };
    sent?: (transaction: any) => void;
    succeeded?: (transaction: any) => void;
    validated?: (successful: boolean, transaction: any) => void;
    failed?: (transaction: any) => void;
    error?: (error: any) => void;
    critical?: (error: any) => void;
    style?: StyleOptions;
    whitelist?: BlockchainStringListOptions;
    blacklist?: BlockchainStringListOptions;
    providers?: BlockchainStringListOptions;
    currency?: string;
    connected?: (address: string) => void;
    closed?: () => void;
    track?: {
      endpoint?: string;
      method?: (payment: any) => void;
      poll?: {
        endpoint?: string;
        method?: (payment: any) => void;
      };
    };
    recover?: {
      blockchain: string;
      transaction: string;
      sender: string;
      nonce: number;
      afterBlock: number;
      token: string;
      amount: number;
    };
    closable?: boolean;
    integration?: string;
    container?: HTMLElement;
    before?: (payment: any) => Promise<void>;
    wallet?: any;
    title?: string;
    action?: string;
    document?: HTMLElement;
  }

  interface PaymentResponse {
    unmount: () => void;
  }

  const Payment: (options: PaymentOptions) => Promise<PaymentResponse>;

  interface ConnectOptions {
    style?: StyleOptions;
    error?: (error: any) => void;
    document?: HTMLElement;
  }

  interface ConnectResponse {
    account: string;
    wallet: any;
  }

  const Connect: (options: ConnectOptions) => Promise<ConnectResponse>;
  
  interface LoginOptions {
    message: string;
    endpoint?: string;
    recover?: (message: string, signature: string) => void;
    wallet?: any;
    style?: StyleOptions;
    error?: (error: any) => void;
    document?: HTMLElement;
  }

  interface LoginResponse {
    account: string;
    wallet: any;
  }

  const Login: (options: LoginOptions) => Promise<LoginResponse>;

  interface SaleOptions {
    sell: BlockchainStringOptions;
    amount?: {
      start?: number;
      min?: number;
      step?: number;
      token?: boolean;
    };
    sent?: (transaction: any) => void;
    succeeded?: (transaction: any) => void;
    failed?: (transaction: any) => void;
    error?: (error: any) => void;
    critical?: (error: any) => void;
    style?: StyleOptions;
    blacklist?: BlockchainStringListOptions;
    providers?: BlockchainStringListOptions;
    currency?: string;
    connected?: (address: string) => void;
    closed?: () => void;
    tokenImage: string;
    closable?: boolean;
    integration?: string;
    wallet?: any;
    document?: HTMLElement;
  }

  interface SaleResponse {
    unmount: () => void;
  }

  const Sale: (options: SaleOptions) => Promise<SaleResponse>;

  interface SelectOptions {
    what: string;
    style?: StyleOptions;
    error?: (error: any) => void;
    document?: HTMLElement;
  }

  const Select: (options: SelectOptions) => Promise<any>;

  interface LoadingOptions {
    text: string;
    style?: StyleOptions;
    error?: (error: any) => void;
    critical?: (error: any) => void;
    document?: HTMLElement;
  }

  const Loading: (options: LoadingOptions) => Promise<any>;
}

declare const DePayWidgets: {
  Connect: DePayWidgets.Connect;
  Login: DePayWidgets.Login;
  Payment: DePayWidgets.Payment;
  Sale: DePayWidgets.Sale;
  Select: DePayWidgets.Select;
  Loading: DePayWidgets.Loading;
};

export default DePayWidgets;
