import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../data/firebase";
import { FILE } from "../types/file-type";
import { IdGenerator } from "./id-generator";

export class Storage {

    createImageURL = async ( file: any, path: string ) => {

        const imageRef = ref( storage, path );
        const metadata = { contentType: file?.mimetype };

        const snapshot = await uploadBytesResumable(
            imageRef,
            file.buffer,
            metadata )

        const url = await getDownloadURL( snapshot.ref )
        return url;

    }

    createGroupURL = async ( urls: FILE[] ) => {

        try {

            let group = []

            for ( let i = 0; i < urls.length; i++ ) {

                const generateURL = await this.createImageURL( urls[i], `product/${new IdGenerator().generateId()}` )
                group.push( generateURL );

            }

            return group;

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

}
