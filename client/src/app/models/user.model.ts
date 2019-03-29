/**
 * @package UserModel
 * @author Tier5 LLC <work@tier5.us>
 * @version 1.0.0
 * @license Proprietary
 */
export class UserModel {
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
