<template>
  <div class="wrapper">
    <div v-if="loading" class="preloader">Загрузка...</div>
    <div v-if="!loading" class="filters">
      <div class="filters__add-new-user">
        <button @click="addNewUser">Добавить сотрудника</button>
      </div>
      <div class="filters__search">
        <input v-model="search" type="search" placeholder="Поиск по ФИО" />
      </div>
      <div class="filters__sort-by-name">
        <span>Сортировать по ФИО:</span>
        <select v-model="sortByName">
          <option value="up">По возрастанию</option>
          <option value="down">По убыванию</option>
        </select>
      </div>
      <div class="filters__sort-by-date">
        <span>Сортировать по дате:</span>
        <select v-model="sortByDate">
          <option value="up">По возрастанию</option>
          <option value="down">По убыванию</option>
        </select>
      </div>
      <div class="filters__filters-by-date">
        <span>Фильтр по дате:</span>
        <input v-model="filter.from" type="date" />
        <input v-model="filter.to" type="date" />
      </div>
    </div>
    <table v-if="!loading" class="users-table">
      <thead>
        <tr>
          <th>Full name</th>
          <th>Birthday</th>
          <th>Phone</th>
          <th>E-mail</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="index">
          <td data-label="Full name">
            <NuxtLink :to="{name: 'users-id', params: {id: index, user: user}}">
              {{ user.name.title }} {{ user.name.first }}
              {{ user.name.last }}</NuxtLink
            >
          </td>
          <td data-label="Birthday">{{ formatDate(index) }}</td>
          <td data-label="Phone">{{ user.phone }}</td>
          <td data-label="E-mail">{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getUsers } from '@/core/getUsers.js'
import { addUser } from '@/core/addUser.js'

export default {
  data() {
    return {
      loading: false,
      users: [],
      search: null,
      sortByName: null,
      sortByDate: null,
      filter: {
        from: null,
        to: null,
      },
    }
  },

  computed: {
    filteredUsers() {
      if (!this.search) return this.users

      return this.users.filter((u) => {
        return (
          u.name.first.toLowerCase().includes(this.search.toLowerCase()) ||
          u.name.last.toLowerCase().includes(this.search.toLowerCase())
        )
      })
    },
  },

  watch: {
    sortByName(value) {
      this.users = this.users.sort(function (a, b) {
        if (value === 'up') {
          if (a.name.first < b.name.first) return -1
          if (a.name.first > b.name.first) return 1

          if (a.name.last < b.name.last) return -1
          if (a.name.last > b.name.last) return 1
        }

        if (value === 'down') {
          if (a.name.first > b.name.first) return -1
          if (a.name.first < b.name.first) return 1

          if (a.name.last > b.name.last) return -1
          if (a.name.last < b.name.last) return 1
        }

        return 0
      })
    },
    sortByDate(value) {
      this.users = this.users.sort(function (a, b) {
        if (value === 'up') {
          if (a.dob.date < b.dob.date) return -1
          if (a.dob.date > b.dob.date) return 1
        }

        if (value === 'down') {
          if (a.dob.date > b.dob.date) return -1
          if (a.dob.date < b.dob.date) return 1
        }

        return 0
      })
    },
    filter: {
      handler(value) {
        const start = value.from ? new Date(value.from) : null
        const end = value.to ? new Date(value.to) : null

        this.users = this.users.filter(
          (u) =>
            !(
              (start && start >= new Date(u.dob.date)) ||
              (end && end <= new Date(u.dob.date))
            )
        )
      },
      deep: true,
    },
  },

  async mounted() {
    const check = JSON.parse(localStorage.getItem('users'))
    if (!check) {
      this.loading = true
      await getUsers(20)
        .then((resp) => {
          this.users = resp
          localStorage.setItem('users', JSON.stringify(resp))
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 2000)
        })
    } else {
      this.users = JSON.parse(localStorage.getItem('users'))
    }
  },

  methods: {
    async addNewUser() {
      this.loading = true
      await addUser()
        .then((resp) => {
          this.users.push(resp[0])
          localStorage.setItem('users', JSON.stringify(this.users))
        })
        .finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 2000)
        })
    },

    formatDate(index) {
      const day = new Date(this.users[index].dob.date).getDate()
      const month = new Date(this.users[index].dob.date).getMonth() + 1
      const year = new Date(this.users[index].dob.date).getFullYear()

      return (
        (day < 10 ? '0' : '') +
        day +
        '-' +
        (month < 10 ? '0' : '') +
        month +
        '-' +
        year
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow-x: auto;

  .preloader {
    height: calc(100vh - 16px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    > div {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      padding-bottom: 10px;

      &.filters__filters-by-date {
        > input {
          margin-left: 5px;
          margin-right: 5px;
        }
      }
    }
  }

  .users-table {
    border: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border-collapse: collapse;
    border-spacing: 0;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);

    > thead {
      height: 40px !important;

      > tr {
        > th {
          text-transform: uppercase;
          line-height: 40px !important;
          text-align: left;
          font-size: 14px;
          font-weight: bold;
          padding-top: 0px !important;
          padding-bottom: 0px !important;

          &:first-child {
            padding-left: 45px;
          }
        }
      }
    }

    > tbody {
      > tr {
        border-top: 1px solid #e5e5e5;
        height: 40px;

        > td {
          height: 40px;
          line-height: 40px !important;
          text-align: left;
          font-size: 16px;

          &:first-child {
            padding-left: 45px;

            > a {
              text-decoration: none;
              color: rgb(43, 43, 253);
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 800px) {
  .filters {
    flex-direction: column;
  }

  .users-table {
    border: 1px solid transparent;
    box-shadow: none;

    > thead {
      display: none;
    }

    > tbody {
      > tr {
        border-bottom: 45px solid #f8f8f8;

        > td {
          display: block;
          text-align: right !important;
          font-size: 14px;
          padding: 0px 10px !important;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);

          &:first-child {
            padding-left: 10px;
          }

          &:before {
            content: attr(data-label);
            float: left;
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
