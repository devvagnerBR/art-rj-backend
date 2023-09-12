export class ProductModel {

    constructor(

        private id: string,
        private owner_id: string,
        private title: string,
        private slug: string,
        private description: string,
        private quantity: number,
        private price: number,
        private images: string[],

    ) { }


    getId(): string { return this.id }
    getOwner_id(): string { return this.owner_id }
    getTitle(): string { return this.title }
    getSlug(): string { return this.slug }
    getDescription(): string { return this.description }
    getQuantity(): number { return this.quantity }
    getPrice(): number { return this.price }
    getImages(): string[] { return this.images }

}