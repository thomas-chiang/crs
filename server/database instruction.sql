-- heroku CLI instruction:

heroku login

heroku create YourAppName

heroku addons:create heroku-postgresql:hobby-dev -a YourAppName

heroku pg:psql -a YourAppName

-- copy and paste code before when connected to heroku database:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT ,
    user_email TEXT ,
    user_password TEXT ,
    pw_reset_token TEXT,
    pw_reset_token_exp TIMESTAMP WITH TIME ZONE,
    position TEXT,
    user_created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_activated BOOLEAN DEFAULT false
);

CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR,
    course_creator VARCHAR,
    course_time TIMESTAMP WITH TIME ZONE,
    course_capacity SMALLINT,
    course_signup_time TIMESTAMP WITH TIME ZONE,
    quit_deadline TIMESTAMP WITH TIME ZONE,
    coach TEXT,
    course_created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE course_user (
    course_id INTEGER, 
    user_id TEXT,
    course_user_created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_waiting BOOLEAN DEFAULT false,
    user_name TExT
);