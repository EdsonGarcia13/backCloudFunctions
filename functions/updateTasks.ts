import { Handler } from '@netlify/functions';
import { supabase } from './config';

export const handler: Handler = async (event) => {

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: ''
    };
  }

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing task data' }) };
  }

  const taskId = event.path.split('updateTask/').pop();
  

  if (!taskId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Task ID is required' }) };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const updates = Object.keys(requestBody).reduce((acc, key) => {
      acc[key.toLowerCase()] = requestBody[key];
      return acc;
    }, {} as Record<string, any>);
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Error updating task' })
    };
  }
};