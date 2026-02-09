

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

console.log('Starting seed script...')

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
console.log(`Loading env from: ${envPath}`)

const result = dotenv.config({ path: envPath })
if (result.error) {
    console.error('Error loading .env.local:', result.error)
}


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// @ts-ignore
async function signUpUser(email: string, password: string, role: string) {
    console.log(`Checking user: ${email}...`)

    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (signInData?.user) {
        console.log(`User already exists: ${email} (ID: ${signInData.user.id})`)
        // Ensure role exists
        const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({ user_id: signInData.user.id, role: role }, { onConflict: 'user_id' })

        if (roleError) console.error(`Error ensuring role for ${email}:`, roleError.message)
        else console.log(`Role '${role}' confirmed for ${email}`)

        return
    }

    console.log(`User not found/could not login. Creating: ${email}...`)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { role },
        },
    })

    if (error) {
        console.error(`Error creating ${email}:`, error.message)
        return
    }

    if (data?.user) {
        console.log(`User created: ${data.user.id}`)

        // Insert into user_roles
        const { error: roleError } = await supabase
            .from('user_roles')
            .insert({ user_id: data.user.id, role: role })

        if (roleError) {
            console.error(`Error assigning role to ${email}:`, roleError.message)
        } else {
            console.log(`Role '${role}' assigned to ${email}`)
        }
    } else {
        console.log(`User creation initiated for ${email}. Please check email for confirmation if required.`)
    }
}

async function main() {
    await signUpUser('admin2@exampaperhub.com', 'admin123', 'admin')
    await signUpUser('student2@exampaperhub.com', 'student123', 'student')
}

main()
