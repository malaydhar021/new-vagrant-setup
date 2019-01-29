export class User {
  id: any;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  stripe_plan: string;
  card_no: number;
  month: number;
  year: number;
  cvc: any;
}

export class Login {
  email: string;
  password: string;
}
