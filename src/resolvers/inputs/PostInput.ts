import { Field, InputType } from 'type-graphql';

@InputType()
export class PostInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  body: string;

  @Field({ nullable: true })
  thumbnail: string;

  @Field()
  categoryId: string;
}
