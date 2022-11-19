import { Application, Graphics } from 'pixi.js';

export default defineComponent({
  setup() {
    const cvs = ref<HTMLCanvasElement>();

    onMounted(() => {
      const app = new Application({
        view: cvs.value as HTMLCanvasElement
      });

      const graphics = new Graphics();
      graphics.lineStyle(2, 0x000000, 1);
    });

    return () => {
      return <canvas ref={cvs}></canvas>;
    };
  }
});
