# Apply Environment
To have one build output for multiple environments, usually on of these two approaches is used:

1. Loading a configuration file on application startup
   * With this approach, environment configuration is fetched on application startup. Downsides of this approach are:
     * Slower startup times (network related)
     * Configuration is easier to spot (potential security issue)
     * Try/Catch block around `root render` method (the easiest way)
       * More complex way would be, adjusting the application architecture to the fact that the config is asynchronous.
2. Leveraging the fact that the output build is set of text files (minified and uglified)
   * With this approach, environment configuration is applied during compile time with specific placeholders, which represent unique environment variable names. By scanning the files and replacing the placeholders, environment configuration is easily applied. Downsides of this approach are:
     * Relying on a script to do the string replacement
     * Having a larger docker image (assuming `nginx` is used) because of additional tools

## Build
Because `apply-environment` is a `node package`, base `nginx:alpine` image is extended with `node` and `npm`.

It is assumed that the output of the `build` build process will contain placeholder strings that can be easily changed. For that purpose `apply-environment` package is used.

To be able to apply environment variables on every container startup the [apply-environment.sh](apply-environment.sh) shell script is copied to `docker-entrypoint.d`, which only invokes the [apply-environment.ts](apply-environment/src/apply-environment.ts) script.

The [apply-environment.ts](apply-environment/src/apply-environment.ts) script iterates trough the `*.js` files and looks for placeholder strings, such as `GOTO_CI_CD_API_URL`, and replaces them with the environment variables with the same name.
