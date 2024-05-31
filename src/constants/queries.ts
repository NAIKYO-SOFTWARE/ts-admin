import {
  FindManyDocument,
  GetLocationsDocument,
  GetProvidersDocument,
  GetRoutesDocument,
  useDeleteLocationMutation,
  useDeleteRouteMutation,
  useDeleteUserMutation,
  useFindManyQuery,
  useFindOneProviderQuery,
  useFindOneQuery,
  useGetCitiesQuery,
  useGetLocationQuery,
  useGetLocationsQuery,
  useGetProvidersQuery,
  useGetRouteQuery,
  useGetRoutesQuery,
  useInsertLocationMutation,
  useInsertProviderMutation,
  useInsertRouteMutation,
  useUpdateLocationMutation,
  useUpdateProviderEnableMutation,
  useUpdateProviderMutation,
  useUpdateRouteMutation,
  useUpdateUserMutation
} from '../generated/graphql'

const queries: Record<string, Record<string, any>> = {
  users: {
    findOne: useFindOneQuery,
    createOne: null,
    updateOne: useUpdateUserMutation,
    findMany: useFindManyQuery,
    deleteOne: useDeleteUserMutation
  },
  locations: {
    findOne: useGetLocationQuery,
    createOne: useInsertLocationMutation,
    updateOne: useUpdateLocationMutation,
    findMany: useGetLocationsQuery,
    deleteOne: useDeleteLocationMutation
  },
  cities: {
    findMany: useGetCitiesQuery
  },
  providers: {
    findOne: useFindOneProviderQuery,
    createOne: useInsertProviderMutation,
    updateOne: useUpdateProviderMutation,
    findMany: useGetProvidersQuery,
    deleteOne: useUpdateProviderEnableMutation
  },
  routes: {
    findOne: useGetRouteQuery,
    createOne: useInsertRouteMutation,
    updateOne: useUpdateRouteMutation,
    findMany: useGetRoutesQuery,
    deleteOne: useDeleteRouteMutation
  }
}

interface Props {
  many?: (data: any) => any[]
  select?: (data: any) => any[]
  one?: (data: any) => Object
}

export const dataHandlers: Record<string, Props> = {
  users: {
    many: (data) => data,
    one: (data) => ({ ...data.users_by_pk })
  },
  routes: {
    many: (data) => {
      return data.map((location: any) => ({
        ...location,
        city: location.city.name,
        start_location: location.startlocation.name,
        end_location: location.endlocation.name
      }))
    },
    one: (data) => {
      return {
        ...data.routes_by_pk,
        start_location: data.routes_by_pk.startlocation.id,
        end_location: data.routes_by_pk.endlocation.id
      }
    }
  },
  locations: {
    many: (data) => {
      return data.map((location: any) => ({
        ...location,
        city: location.city.name
      }))
    },
    one: (data) => ({ ...data.locations_by_pk, city_id: data.locations_by_pk.city.id }),
    select: (data) => data.map((data: any) => ({ label: data.name, value: data.id }))
  },
  cities: {
    select: (data) => data.map((data: any) => ({ label: data.name, value: data.id }))
  },
  providers: {
    many: (data) => data,
    one: (data) => ({ ...data.providers_by_pk })
  }
}

export const queryStrings: Record<string, Record<string, any>> = {
  users: {
    role: { _eq: 'user' }
  }
}

export const documentNodes: Record<string, Record<string, any>> = {
  users: {
    getDocument: FindManyDocument
  },
  locations: {
    getDocument: GetLocationsDocument
  },
  providers: {
    getDocument: GetProvidersDocument
  },
  routes: {
    getDocument: GetRoutesDocument
  }
}

export default queries
