import {
  GetBookingsDocument,
  GetCitiesDocument,
  GetItinerariesDocument,
  GetLocationsDocument,
  GetProvidersDocument,
  GetRoutesDocument,
  GetUsersDocument,
  useDeleteItineraryMutation,
  useDeleteLocationMutation,
  useDeleteProviderMutation,
  useDeleteRouteMutation,
  useDeleteUserMutation,
  useFindOneProviderQuery,
  useFindOneQuery,
  useGetBookingQuery,
  useGetBookingsQuery,
  useGetCitiesQuery,
  useGetCityQuery,
  useGetItinerariesQuery,
  useGetItineraryQuery,
  useGetLocationQuery,
  useGetLocationsQuery,
  useGetOptionsQuery,
  useGetProvidersQuery,
  useGetRouteQuery,
  useGetRoutesQuery,
  useGetUsersQuery,
  useGetVehicleTypesQuery,
  useInsertItineraryMutation,
  useInsertLocationMutation,
  useInsertProviderMutation,
  useInsertRouteMutation,
  useUpdateBookingMutation,
  useUpdateCityMutation,
  useUpdateItineraryMutation,
  useUpdateLocationMutation,
  useUpdateProviderEnableMutation,
  useUpdateProviderMutation,
  useUpdateRouteMutation,
  useUpdateUserMutation
} from '../generated/graphql'

const queries: Record<string, Record<string, any>> = {
  users: {
    findOne: useFindOneQuery,
    updateOne: useUpdateUserMutation,
    findMany: useGetUsersQuery,
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
    findOne: useGetCityQuery,
    createOne: null,
    updateOne: useUpdateCityMutation,
    findMany: useGetCitiesQuery,
    deleteOne: useDeleteUserMutation
  },
  providers: {
    findOne: useFindOneProviderQuery,
    createOne: useInsertProviderMutation,
    updateOne: useUpdateProviderMutation,
    findMany: useGetProvidersQuery,
    deleteOne: useDeleteProviderMutation
  },
  routes: {
    findOne: useGetRouteQuery,
    createOne: useInsertRouteMutation,
    updateOne: useUpdateRouteMutation,
    findMany: useGetRoutesQuery,
    deleteOne: useDeleteRouteMutation,
    copyOne: useInsertRouteMutation
  },
  bookings: {
    findOne: useGetBookingQuery,
    updateOne: useUpdateBookingMutation,
    findMany: useGetBookingsQuery,
    deleteOne: useUpdateProviderEnableMutation
  },
  itinerary: {
    findOne: useGetItineraryQuery,
    createOne: useInsertItineraryMutation,
    updateOne: useUpdateItineraryMutation,
    findMany: useGetItinerariesQuery,
    deleteOne: useDeleteItineraryMutation
  },
  options: {
    findMany: useGetOptionsQuery
  },
  vehicle_types: {
    findMany: useGetVehicleTypesQuery
  }
}

export const paramHandlers = {
  bookings: {
    dataHandler: (data: any) => ({
      updateData: { id: data.id, status: data.status, bookingDate: data.bookingDate, note: data.note }
    })
  }
}
interface Props {
  many?: (data: any) => any[]
  select?: (data: any) => any[]
  one?: (data: any) => Object
  copy?: (data: any) => Object
  insertOne?: (data: any) => Object
}

export const dataHandlers: Record<string, Props> = {
  users: {
    many: (data) => data,
    one: (data) => {
      const bookings = data.users_by_pk.bookings.map((booking: any) => ({
        ...booking,
        route: {
          label: `${booking.itinerary.route.startlocation.name} - ${booking.itinerary.route.endlocation.name}`,
          path: '/routes',
          id: booking.itinerary.route.id
        },
        id: {
          label: `Booking order - ${booking.id}`,
          path: '/bookings',
          id: booking.id
        },
        provider: {
          label: `${booking.itinerary.provider.name}`,
          path: '/providers',
          id: booking.itinerary.provider.id
        },
        option: booking.itinerary.option.round_type,
        vehicle_type: booking.itinerary.vehicle_type.type
      }))
      return { ...data.users_by_pk, bookings }
    }
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
      const itineraries = data.routes_by_pk.itineraries.map((itinerary: any, idx: number) => ({
        ...itinerary,
        id: {
          label: `Itineraries ${idx}`,
          path: '/itinerary',
          id: itinerary.id
        },
        option: itinerary.option.round_type,
        provider: itinerary.provider.name,
        vehicle_type: itinerary.vehicle_type.type
      }))
      return {
        ...data.routes_by_pk,
        start_location: data.routes_by_pk.startlocation.id,
        end_location: data.routes_by_pk.endlocation.id,
        itineraries
      }
    },
    copy: (data) => {
      return {
        ...data,
        start_location: data.startlocation.id,
        end_location: data.endlocation.id
      }
    },
    insertOne: (data) => {
      return {
        ...data.insert_routes_one,
        start_location: data.insert_routes_one.startlocation.name,
        end_location: data.insert_routes_one.endlocation.name,
        city: data.insert_routes_one.city.name
      }
    },
    select: (data) =>
      data.map((data: any) => ({ label: `${data.startlocation.name} - ${data.endlocation.name}`, value: data.id }))
  },
  locations: {
    many: (data) => {
      return data.map((location: any) => ({
        ...location,
        city: location.city.name
      }))
    },
    one: (data) => {
      const routes = data.locations_by_pk.routes.map((route: any) => ({
        ...route,
        id: {
          label: `${route.startlocation.name} - ${route.endlocation.name}`,
          path: '/routes',
          id: route.id
        }
      }))

      return { ...data.locations_by_pk, city_id: data.locations_by_pk.city.id, routes }
    },
    select: (data) => data.map((data: any) => ({ label: data.name, value: data.id }))
  },
  cities: {
    select: (data) => data.map((data: any) => ({ label: data.name, value: data.id })),
    many: (data) => data,
    one: (data) => {
      const locations = data.cities_by_pk.locations.map((location: any) => ({
        ...location,
        name: {
          label: `${location.name}`,
          path: '/locations',
          id: location.id
        }
      }))
      return { ...data.cities_by_pk, name: data.cities_by_pk.name, isactive: data.cities_by_pk.isactive, locations }
    }
  },
  providers: {
    many: (data) => data,
    one: (data) => ({ ...data.providers_by_pk }),
    select: (data) => data.map((data: any) => ({ label: data.name, value: data.id }))
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
  },
  itinerary: {
    many: (data) => {
      return data.map((itinerary: any) => ({
        ...itinerary,
        isactive: itinerary.isactive,
        created_at: itinerary.created_at,
        provider: itinerary.provider.name,
        route: `${itinerary.route.startlocation.name} - ${itinerary.route.endlocation.name}`,
        option: itinerary.option.round_type
      }))
    },
    one: (data) => ({
      ...data.itinerary_by_pk
    })
  },
  options: {
    select: (data) => data.map((data: any) => ({ label: data.round_type, value: data.id }))
  },
  vehicle_types: {
    select: (data) => data.map((data: any) => ({ label: data.type, value: data.id }))
  }
}

export const queryStrings: Record<string, Record<string, any>> = {
  users: {
    role: { _eq: 'user' }
  }
}

export const documentNodes: Record<string, Record<string, any>> = {
  users: {
    getDocument: GetUsersDocument
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
  },
  itinerary: {
    getDocument: GetItinerariesDocument
  },
  cities: {
    getDocument: GetCitiesDocument
  }
}

export default queries
