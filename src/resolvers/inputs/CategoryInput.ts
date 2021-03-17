import { Field, InputType } from 'type-graphql';

@InputType()
export class CategoryInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  thumbnail: string;
}
