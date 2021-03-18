import { Field, InputType } from 'type-graphql';

@InputType()
export class PageInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
