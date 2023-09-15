-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
