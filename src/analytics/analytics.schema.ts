import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ required: true })
  userId: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop({ type: Object })
  bodyMetrics: object;

  @Prop({ type: Object })
  goal: object;

  @Prop({ type: Object })
  heartHealth: object;

  @Prop({ type: Array })
  weightProjection: object[];
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
