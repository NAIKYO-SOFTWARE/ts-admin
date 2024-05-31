import {
  FindManyDocument,
  GetBookingsDocument,
  GetLocationsDocument,
  GetProvidersDocument,
  GetRoutesDocument,
  useDeleteLocationMutation,
  useDeleteRouteMutation,
  useDeleteUserMutation,
  useFindManyQuery,
  useFindOneProviderQuery,
  useFindOneQuery,
  useGetBookingQuery,
  useGetBookingsQuery,
  useGetCitiesQuery,
  useGetLocationQuery,
  useGetLocationsQuery,
  useGetProvidersQuery,
  useGetRouteQuery,
  useGetRoutesQuery,
  useInsertLocationMutation,
  useInsertProviderMutation,
  useInsertRouteMutation,
  useUpdateBookingMutation,
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
  },
  bookings: {
    findOne: useGetBookingQuery,
    createOne: null,
    updateOne: useUpdateBookingMutation,
    findMany: useGetBookingsQuery,
    deleteOne: useUpdateProviderEnableMutation
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
  },
  bookings: {
    many: (data) => {
      return data.map((booking: any) => ({
        ...booking,
        name: booking.user.name,
        price: booking.itinerary.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        userPhoneNumber: booking.user.phone_number
      }))
    },
    one: (data) => ({
      ...data.bookings_by_pk,
      userName: data.bookings_by_pk.user.name,
      userPhoneNumber: data.bookings_by_pk.user.phone_number,
      city: data.bookings_by_pk.itinerary.route.city.name,
      startLocation: data.bookings_by_pk.itinerary.route.city.routes[0].startlocation.name,
      endLocation: data.bookings_by_pk.itinerary.route.city.routes[0].endlocation.name,
      option: data.bookings_by_pk.itinerary.option.round_type,
      vehicleType: data.bookings_by_pk.itinerary.vehicle_type.type,
      price: data.bookings_by_pk.itinerary.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      providerName: data.bookings_by_pk.itinerary.provider.name,
      providerPhoneNumber: data.bookings_by_pk.itinerary.provider.phone_number,
      orderNote: data.bookings_by_pk.note,
      bookingDate: data.bookings_by_pk.booking_date
    })
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
  },
  bookings: {
    getDocument: GetBookingsDocument
  }
}

export default queries
