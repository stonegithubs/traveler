import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: 500 }) width: number
  @Prop({ required: true }) show: boolean
}
