import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../data/firebase";

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

}