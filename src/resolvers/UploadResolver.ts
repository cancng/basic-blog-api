import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { FileUpload } from 'graphql-upload';
import { GraphQLUpload as GQLUpload } from 'apollo-server-express';
import { parse } from 'path';
import fs from 'fs';
import { path } from 'app-root-path';
import { isAuth } from '../middlewares/isAuth';
import { generateSlug } from '../util/functions';

@ObjectType()
class UploadResponse {
  @Field()
  file: string;
}

@Resolver()
export class UploadResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => UploadResponse)
  async uploadImage(
    @Arg('image', () => GQLUpload!)
    { createReadStream, filename, mimetype }: FileUpload
  ): Promise<UploadResponse> {
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      throw new Error('Sadece resim dosyası yükleyebilirsin (jpg, jpeg, png)');
    }

    try {
      const { name, ext } = parse(filename);
      const newFileName = `${new Date().getTime()}-${generateSlug(name)}${ext}`;
      const stream = createReadStream();

      stream.pipe(fs.createWriteStream(`${path}/public/images/${newFileName}`));

      return {
        file: newFileName,
      };
    } catch (error) {
      console.log('upload err ⚠️', error);
      throw error;
    }
  }
}
