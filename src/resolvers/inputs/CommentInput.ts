import { Field, InputType } from 'type-graphql';

@InputType()
export class CommentInput {
  @Field({ nullable: true })
  authorName: string;

  @Field()
  body: string;
}
