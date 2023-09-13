export class ProductModel {


    private main_image: string

    constructor(

        private id: string,
        private owner_id: string,
        private title: string,
        private slug: string,
        private description: string,
        private quantity: number,
        private price: number,
        private images: string[],


    ) {
        this.main_image = images[0]
    }


    getId(): string { return this.id }
    getOwner_id(): string { return this.owner_id }
    getTitle(): string { return this.title }
    getSlug(): string { return this.slug }
    getDescription(): string { return this.description }
    getQuantity(): number { return Number( this.quantity ) }
    getPrice(): number { return Number( this.price ) }
    getImages(): string[] { return this.images }
    getMainImage(): string { return this.main_image }

}