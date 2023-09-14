export class PaymentModel {


    constructor(

        private id: string,
        private product_id: string,
        private user_id: string,


    ) { }

    getId(): string { return this.id }
    getProductId(): string { return this.product_id }
    getUserId(): string { return this.user_id }


}