<script setup lang="ts">
import { NTable } from 'naive-ui';
import Point from '~/types/bi-he-dao-xian-zuo-biao-ji-suan-biao/Point';
import { dms2Number } from '~/utils/convert';
import { prettifyDms } from '~/utils/format';

const points = useStorage<Point[]>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-points',
  [],
  localStorage
);

const zhuanZheJiaoSum = computed(() => {
  if (!points.value.length) {
    return 0;
  }
  return points.value
    .map(el => dms2Number(el.angle))
    .reduce((prev, cur) => prev + cur);
});

const gaiZhengShu = computed(() => {
  let remain = 360 - zhuanZheJiaoSum.value;
  return distance.value.map(val => (remain * val) / distanceSum.value);
});

const gaiZhengHouZhuanJiao = computed(() => {
  return points.value.map((point, index) => {
    return dms2Number(point.angle) + gaiZhengShu.value[index];
  });
});

const initDirectionAngle = ref<Dms>({
  degree: 30,
  minute: 0,
  second: 0
});

const initZuoBiao = ref({
  x: 300000,
  y: 300000
});

const directionAngle = computed(() => {
  let res: number[] = [dms2Number(initDirectionAngle.value)];
  for (let i = 0; i < points.value.length; ++i) {
    res.push(
      res[i] - gaiZhengHouZhuanJiao.value[(i + 1) % points.value.length] + 180
    );
  }
  return res;
});

const zuoBiao = computed(() => {
  let res = [initZuoBiao.value];
  for (let i = 0; i < gaiZhengHouZuoBiaoZengLiang.value.length; ++i) {
    res.push({
      x: res[i].x + gaiZhengHouZuoBiaoZengLiang.value[i].x,
      y: res[i].y + gaiZhengHouZuoBiaoZengLiang.value[i].y
    });
  }
  return res;
});

const distance = useStorage<number[]>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-distance',
  [],
  localStorage
);

const zuoBiaoZengLiang = computed(() => {
  return distance.value.map((val, index) => ({
    x: val * Math.sin((directionAngle.value[index] * Math.PI) / 180),
    y: val * Math.cos((directionAngle.value[index] * Math.PI) / 180)
  }));
});

const gaiZhengHouZuoBiaoZengLiang = computed(() => {
  return distance.value.map((val, index) => ({
    x:
      zuoBiaoZengLiang.value[index].x +
      (zuoBiaoZengLiangSum.value.x * val) / distanceSum.value,
    y:
      zuoBiaoZengLiang.value[index].y +
      (zuoBiaoZengLiangSum.value.y / val) * distanceSum.value
  }));
});

const distanceSum = computed(() => {
  if (!distance.value.length) {
    return 0;
  }
  return distance.value.reduce((x, y) => x + y);
});

const zuoBiaoZengLiangSum = computed(() => {
  if (zuoBiaoZengLiang.value.length) {
    return zuoBiaoZengLiang.value.reduce((prev, cur) => ({
      x: prev.x + cur.x,
      y: prev.y + cur.y
    }));
  } else {
    return { x: 0, y: 0 };
  }
});

function handleAdd() {
  points.value.push({
    id: '',
    angle: {
      degree: Math.random() * 360,
      minute: Math.random() * 60,
      second: Math.random() * 60
    }
  });
  distance.value.push(Math.random() * 10);
}

function handleDelete(index: number) {
  points.value.splice(index, 1);
  distance.value.splice(index, 1);
}
</script>

<template>
  <v-card overflow-auto>
    <NTable p="sm" min-w="1280px" :single-line="false">
      <thead>
        <tr>
          <th
            rowspan="2"
            v-for="th in [
              '点号',
              '转折角',
              '改正数',
              '改正后转折角',
              '方位角α',
              '边长'
            ]"
            :key="th"
          >
            {{ th }}
          </th>
          <th colspan="2">坐标增量</th>
          <th colspan="2">改正后坐标增量</th>
          <th colspan="2">坐标</th>
          <th rowspan="2">操作</th>
        </tr>
        <tr>
          <th>Δx</th>
          <th>Δy</th>
          <th>Δx</th>
          <th>Δy</th>
          <th>x</th>
          <th>y</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(point, index) in points" :key="point.id">
          <tr h-10>
            <td rowspan="2" w="32">
              <n-input v-model:value="point.id"></n-input>
            </td>
            <td rowspan="2" w="72">
              <div inline-block w="18">
                <n-input-number
                  v-model:value="point.angle.degree"
                  :show-button="false"
                ></n-input-number>
              </div>
              °
              <div inline-block w="14">
                <n-input-number
                  v-model:value="point.angle.minute"
                  :show-button="false"
                ></n-input-number>
              </div>
              ′
              <div inline-block w="14">
                <n-input-number
                  v-model:value="point.angle.second"
                  :show-button="false"
                ></n-input-number>
              </div>
              ″
            </td>
            <td rowspan="2">
              {{ prettifyDms(gaiZhengShu[index]) }}
            </td>
            <td rowspan="2">
              {{ prettifyDms(gaiZhengHouZhuanJiao[index]) }}
            </td>
            <td v-if="index === 0" v-for="_ in 6"></td>
            <template v-if="index === 0">
              <td rowspan="2" w="54">
                <n-input-number
                  :show-button="false"
                  v-model:value="initZuoBiao.x"
                ></n-input-number>
              </td>
              <td rowspan="2" w="54">
                <n-input-number
                  :show-button="false"
                  v-model:value="initZuoBiao.y"
                ></n-input-number>
              </td>
            </template>
            <template v-else>
              <td rowspan="2">{{ zuoBiao[index].x.toFixed(4) }}</td>
              <td rowspan="2">{{ zuoBiao[index].y.toFixed(4) }}</td>
            </template>
            <td rowspan="2">
              <v-btn icon color="error" @click="() => handleDelete(index)">
                <i i-mdi-delete text-xl></i>
              </v-btn>
            </td>
          </tr>
          <tr h-10>
            <td rowspan="2" v-if="index === 0" w="72">
              <div inline-block w="18">
                <n-input-number
                  v-model:value="initDirectionAngle.degree"
                  :show-button="false"
                ></n-input-number>
              </div>
              °
              <div inline-block w="14">
                <n-input-number
                  v-model:value="initDirectionAngle.minute"
                  :show-button="false"
                ></n-input-number>
              </div>
              ′
              <div inline-block w="14">
                <n-input-number
                  v-model:value="initDirectionAngle.second"
                  :show-button="false"
                ></n-input-number>
              </div>
              ″
            </td>
            <td rowspan="2" v-else>{{ prettifyDms(directionAngle[index]) }}</td>
            <td rowspan="2" w="32">
              <n-input-number
                v-model:value="distance[index]"
                :show-button="false"
              ></n-input-number>
            </td>
            <td rowspan="2">{{ zuoBiaoZengLiang[index].x.toFixed(4) }}</td>
            <td rowspan="2">{{ zuoBiaoZengLiang[index].y.toFixed(4) }}</td>
            <td rowspan="2">
              {{ gaiZhengHouZuoBiaoZengLiang[index].x.toFixed(4) }}
            </td>
            <td rowspan="2">
              {{ gaiZhengHouZuoBiaoZengLiang[index].y.toFixed(4) }}
            </td>
          </tr>
        </template>
        <tr h-10>
          <td rowspan="2">
            <v-btn icon color="primary" @click="handleAdd">
              <i i-mdi-plus text-xl></i>
            </v-btn>
          </td>
          <td rowspan="2" v-for="_ in 3"></td>
        </tr>
        <tr h-10></tr>
        <tr h-10>
          <td rowspan="1">
            <span text-lg font-bold>Σ</span>
          </td>
          <td>{{ prettifyDms(zhuanZheJiaoSum) }}</td>
          <td>
            {{ prettifyDms(360 - zhuanZheJiaoSum) }}
          </td>
          <td>{{ prettifyDms(360) }}</td>
          <td></td>
          <td>{{ distanceSum.toFixed(4) }}</td>
          <td>{{ zuoBiaoZengLiangSum.x.toFixed(4) }}</td>
          <td>{{ zuoBiaoZengLiangSum.y.toFixed(4) }}</td>
        </tr>
        <tr h-10 colspan="13">
          fD =
          {{
            Math.sqrt(
              Math.pow(zuoBiaoZengLiangSum.x, 2) +
                Math.pow(zuoBiaoZengLiangSum.y, 2)
            ) / distanceSum
          }}
        </tr>
      </tbody>
    </NTable>
  </v-card>
</template>

<style scoped></style>
