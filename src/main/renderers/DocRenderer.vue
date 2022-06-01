<template>
  <slot v-bind="{ avatar, displayName }">
    <q-item-section v-if="avatar" avatar class="q-pr-none">
      <q-avatar
        :color="avatar.color || 'grey'"
        :icon="avatar.icon"
        size="48px"
        text-color="white"
      >
        <q-img
          v-if="avatar.url"
          :src="avatar.url"
          width="48px"
          height="48px"
          spinner-size="48px"
          fit="contain"
        ></q-img>
        <div v-if="chip">{{ displayName }}</div>
      </q-avatar>
    </q-item-section>
    <q-item-section>
      {{ displayName }}
    </q-item-section>
  </slot>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';

type AvatarParser = (doc: Record<string, unknown> | undefined) => {
  icon?: string;
  url?: string;
  color?: string;
  text?: string;
};
export default defineComponent({
  name: 'DocSnapshotRenderer',
  props: {
    avatarParser: {} as PropType<AvatarParser>,
    content: {} as PropType<Record<string, unknown>>,
    chip: Boolean,
    name: String,
  },
  setup(props) {
    const defaultParser = (doc: Record<string, unknown> | undefined) =>
      !doc?.image && !doc?.icon && !doc?.text && !doc?.color
        ? undefined
        : {
            url: doc?.image,
            icon: doc?.icon,
            text: doc?.text,
            color: doc?.color,
          };
    const avatar = computed(() =>
      props.avatarParser
        ? props.avatarParser(props.content)
        : defaultParser(props.content)
    );
    const displayName = computed(() => avatar.value?.text || props.name || '');
    return {
      avatar,
      displayName,
    };
  },
});
</script>
