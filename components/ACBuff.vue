<template>
  <v-row dense>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="bullsEye"
        ><template #label>
          <img src="~/static/be.gif" />
          Bull's Eye
        </template>
      </v-switch>
    </v-col>
    <v-col cols="6" md="5">
      <v-switch v-model="_buff" value="eagleEye">
        <template #label>
          <img src="~/static/hawk_eye.gif" />
          Eagle Eye
        </template>
      </v-switch>
    </v-col>
    <v-col cols="12" md="8">
      <v-switch v-model="_buff" value="gunBooster">
        <template #label>
          <img src="~/static/guns.gif" />
          Gun Booster
        </template>
      </v-switch>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'nuxt-property-decorator'
import { ACBuffName } from '~/types'

@Component({})
export default class AcBuff extends Vue {
  @PropSync('buff', { required: true })
  _buff!: ACBuffName[]
}
</script>
