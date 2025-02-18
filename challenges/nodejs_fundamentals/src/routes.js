import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title && !description) {
        return res
          .writeHead(400)
          .write('Title and description are required')
          .end()
      }
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res
        .writeHead(201)
        .end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        name: search,
        email: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title && !description) {
        return res
          .writeHead(400)
          .write('Title and description are required')
          .end()
      }

      const checkIfTaskExists = database.select('tasks', { id })[0]

      if (!checkIfTaskExists) {
        return res
          .writeHead(404)
          .write('Task not found')
          .end()
      }

      const task = {
        title,
        description,
        completed_at: checkIfTaskExists.completed_at,
        created_at: checkIfTaskExists.created_at,
        updated_at: new Date()
      }

      database.update('tasks', id, task)

      return res
        .writeHead(204)
        .end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const checkIfTaskExists = database.select('tasks', { id })

      if (!checkIfTaskExists) {
        return res
          .writeHead(404)
          .write('Task not found')
          .end()
      }

      database.delete('tasks', id)

      return res
        .writeHead(204)
        .end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const checkIfTaskExists = database.select('tasks', { id })[0]

      if (!checkIfTaskExists) {
        return res
          .writeHead(404)
          .write('Task not found')
          .end()
      }

      const task = {
        title: checkIfTaskExists.title,
        description: checkIfTaskExists.description,
        completed_at: new Date(),
        created_at: checkIfTaskExists.created_at,
        updated_at: new Date()
      }

      database.update('tasks', id, task)

      return res
        .writeHead(204)
        .end()
    }
  }
]