# Sources - A list of helpful documentation for working with Ollama and Nvidia

## Nvidia Container Toolkit

- [Nvidia Container Toolkit Home](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/index.html)
- [Specialized Configurations with Docker](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/docker-specialized.html)
- [Nvidia Container Toolkit Repository Information](https://nvidia.github.io/nvidia-container-runtime/)

### Using Nvidia GPUs in Docker

#### GPU Enumeration

GPUs can be specified to the Docker CLI using either the --gpus option starting with Docker 19.03 or using the environment variable NVIDIA_VISIBLE_DEVICES. This variable controls which GPUs will be made accessible inside the container.  

The possible values of the NVIDIA_VISIBLE_DEVICES variable are:

| Possible values            | Description                                      |
|----------------------------|--------------------------------------------------|
| 0,1,2, or GPU-fef8089b     | a comma-separated list of GPU UUID(s) or index(es). |
| all                        | all GPUs will be accessible, this is the default value in base CUDA container images. |
| none                       | no GPU will be accessible, but driver capabilities will be enabled. |
| void or empty or unset     | nvidia-container-runtime will have the same behavior as runc (i.e. neither GPUs nor capabilities are exposed) |

> When using the --gpus option to specify the GPUs, the device parameter should be used. This is shown in the examples below. The format of the device parameter should be encapsulated within single quotes, followed by double quotes for the devices you want enumerated to the container. For example: '"device=2,3"' will enumerate GPUs 2 and 3 to the container.
>
> When using the NVIDIA_VISIBLE_DEVICES variable, you may need to set --runtime to nvidia unless already set as default.

1. Starting a GPU enabled CUDA container; using `--gpus`

```bash
docker run --rm --gpus all nvidia/cuda nvidia-smi
```

2. Using `NVIDIA_VISIBLE_DEVICES` and specify the nvidia runtime

```bash
docker run --rm --gpudocker run --rm --runtime=nvidia \
    -e NVIDIA_VISIBLE_DEVICES=all nvidia/cuda nvidia-smis all nvidia/cuda nvidia-smi
```

3. Starting a GPU enabled container on specific GPUs

```bash
docker run --gpus '"device=1,2"' \
    nvidia/cuda nvidia-smi --query-gpu=uuid --format=csv
```

### Driver Capabilities

The NVIDIA_DRIVER_CAPABILITIES controls which driver libraries/binaries will be mounted inside the container.

The possible values of the NVIDIA_DRIVER_CAPABILITIES variable are:

| Possible values | Description |
|------------------|-------------|
| compute,video or graphics,utility | a comma-separated list of driver features the container needs. |
| all | enable all available driver capabilities. |
| empty or unset | use default driver capability: utility, compute. |

The supported driver capabilities are provided below:

| Driver Capability | Description |
|-------------------|-------------|
| compute           | required for CUDA and OpenCL applications. |
| compat32          | required for running 32-bit applications. |
| graphics          | required for running OpenGL and Vulkan applications. |
| utility           | required for using nvidia-smi and NVML. |
| video             | required for using the Video Codec SDK. |
| display           | required for leveraging X11 display. |

For example, specify the compute and utility capabilities, allowing usage of CUDA and NVML

```bash
docker run --rm --runtime=nvidia \
    -e NVIDIA_VISIBLE_DEVICES=2,3 \
    -e NVIDIA_DRIVER_CAPABILITIES=compute,utility \
    nvidia/cuda nvidia-smi
```

```bash
docker run --rm --gpus 'all,"capabilities=compute,utility"' \
    nvidia/cuda:11.6.2-base-ubuntu20.04 nvidia-smi
```

### Constraints

The NVIDIA runtime also provides the ability to define constraints on the configurations supported by the container.
NVIDIA_REQUIRE_* Constraints

This variable is a logical expression to define constraints on the software versions or GPU architectures on the container.

The supported constraints are provided below:

| Constraint | Description |
|------------|-------------|
| cuda       | constraint on the CUDA driver version. |
| driver     | constraint on the driver version. |
| arch       | constraint on the compute architectures of the selected GPUs. |
| brand      | constraint on the brand of the selected GPUs (e.g. GeForce, Tesla, GRID). |

Multiple constraints can be expressed in a single environment variable: space-separated constraints are ORed, comma-separated constraints are ANDed. Multiple environment variables of the form NVIDIA_REQUIRE_* are ANDed together.

For example, the following constraints can be specified to the container image for constraining the supported CUDA and driver versions:

```bash
NVIDIA_REQUIRE_CUDA "cuda>=11.0 driver>=450"
```

### NVIDIA_DISABLE_REQUIRE Environment Variable

Single switch to disable all the constraints of the form NVIDIA_REQUIRE_*.

### Note

If you are running CUDA-base images older than CUDA 11.7 (and unable to update to the new base images with updated constraints), CUDA compatibility checks can be disabled by setting NVIDIA_DISABLE_REQUIRE to true.
NVIDIA_REQUIRE_CUDA Constraint

The version of the CUDA toolkit used by the container. It is an instance of the generic NVIDIA_REQUIRE_* case and it is set by official CUDA images. If the version of the NVIDIA driver is insufficient to run this version of CUDA, the container will not be started. This variable can be specified in the form major.minor

The possible values for this variable: cuda>=7.5, cuda>=8.0, cuda>=9.0 and so on.
Dockerfiles

Capabilities and GPU enumeration can be set in images via environment variables. If the environment variables are set inside the Dockerfile, you don’t need to set them on the docker run command-line.

For instance, if you are creating your own custom CUDA container, you should use the following:

```bash
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility
```

These environment variables are already set in the NVIDIA provided CUDA images.
| Constraint | Description |
|------------|-------------|
| cuda       | constraint on the CUDA driver version. |
| driver     | constraint on the driver version. |
| arch       | constraint on the compute architectures of the selected GPUs. |
| brand      | constraint on the brand of the selected GPUs (e.g. GeForce, Tesla, GRID). |

constraint on the brand of the selected GPUs (e.g. GeForce, Tesla, GRID).

Multiple constraints can be expressed in a single environment variable: space-separated constraints are ORed, comma-separated constraints are ANDed. Multiple environment variables of the form NVIDIA_REQUIRE_* are ANDed together.

For example, the following constraints can be specified to the container image for constraining the supported CUDA and driver versions:

NVIDIA_REQUIRE_CUDA "cuda>=11.0 driver>=450"

NVIDIA_DISABLE_REQUIRE Environment Variable

Single switch to disable all the constraints of the form NVIDIA_REQUIRE_*.

Note

If you are running CUDA-base images older than CUDA 11.7 (and unable to update to the new base images with updated constraints), CUDA compatibility checks can be disabled by setting NVIDIA_DISABLE_REQUIRE to true.
NVIDIA_REQUIRE_CUDA Constraint

The version of the CUDA toolkit used by the container. It is an instance of the generic NVIDIA_REQUIRE_* case and it is set by official CUDA images. If the version of the NVIDIA driver is insufficient to run this version of CUDA, the container will not be started. This variable can be specified in the form major.minor

The possible values for this variable: cuda>=7.5, cuda>=8.0, cuda>=9.0 and so on.
Dockerfiles

Capabilities and GPU enumeration can be set in images via environment variables. If the environment variables are set inside the Dockerfile, you don’t need to set them on the docker run command-line.

For instance, if you are creating your own custom CUDA container, you should use the following:

ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

These environment variables are already set in the NVIDIA provided CUDA images.

## Mise (mise-en-place)

- [Mise Docs Home](https://mise.jdx.dev/)
- [Mise / Tools](https://mise.jdx.dev/dev-tools/)