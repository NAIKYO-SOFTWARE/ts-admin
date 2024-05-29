import {
  useDeleteLocationMutation,
  useDeleteUserMutation,
  useFindManyQuery,
  useFindOneQuery,
  useGetCitiesQuery,
  useGetLocationQuery,
  useGetLocationsQuery,
  useInsertLocationMutation,
  useUpdateLocationMutation,
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
  locations: {
    many: (data) => {
      return data.map((location: any) => ({
        ...location,
        city: location.city.name
      }))
    },
    one: (data) => ({ ...data.locations_by_pk, city_id: data.locations_by_pk.city.id })
  },
  cities: {
    select: (data) => data.map((data: any) => ({ label: data.name, value: data.id }))
  }
}

export default queries
