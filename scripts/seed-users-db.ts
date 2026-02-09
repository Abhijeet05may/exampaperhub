
import { Client } from 'pg'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

console.log('Starting direct DB seed script...')

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
dotenv.config({ path: envPath })

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL

if (!connectionString) {
  console.error('Missing DIRECT_URL or DATABASE_URL')
  process.exit(1)
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

// @ts-ignore
async function createUser(email: string, password: string, role: string) {
  console.log(`Checking existence of ${email}...`)
  const existingRes = await client.query('SELECT id FROM auth.users WHERE email = $1', [email])
  if (existingRes.rows.length > 0) {
    console.log(`User already exists: ${email}`)
    const userId = existingRes.rows[0].id

    // Ensure role manual check
    await client.query(`
      INSERT INTO public.user_roles (user_id, role)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role
    `, [userId, role])
    console.log(`Role '${role}' ensured for ${email}`)
    return
  }

  console.log(`Creating user: ${email}...`)
  const id = uuidv4()
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const now = new Date().toISOString()

  // 1. Insert into auth.users
  try {
    await client.query('BEGIN')

    await client.query(`
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        $1,
        'authenticated',
        'authenticated',
        $2,
        $3,
        $4,
        NULL,
        NULL,
        '{"provider":"email","providers":["email"]}',
        $5,
        FALSE,
        $4,
        $4,
        NULL,
        NULL,
        '',
        '',
        '',
        ''
      )
    `, [id, email, hash, now, JSON.stringify({ role })])

    // 2. Insert into auth.identities
    const identityId = uuidv4()
    await client.query(`
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        $1,
        $2,
        $3,
        'email',
        $5,
        NULL,
        $4,
        $4
      )
    `, [identityId, id, JSON.stringify({ sub: id, email }), now, email])

    // 3. Insert into public.user_roles
    await client.query(`
      INSERT INTO public.user_roles (user_id, role)
      VALUES ($1, $2)
    `, [id, role])

    await client.query('COMMIT')
    console.log(`Successfully created user: ${email} (ID: ${id})`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(`Failed to create user ${email}:`, err)
    throw err
  }
}

async function main() {
  await client.connect()
  try {
    await createUser('admin@exampaperhub.com', 'admin123', 'admin')
    await createUser('student@exampaperhub.com', 'student123', 'student')
  } catch (err) {
    console.error('Script failed:', err)
  } finally {
    await client.end()
  }
}

main()
