export const useGodly = () => {
  const route = useRoute()
  return computed(() => route.query.godly === 'true')
}
